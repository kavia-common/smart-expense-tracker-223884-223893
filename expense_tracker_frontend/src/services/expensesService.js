import { supabase } from '../lib/supabaseClient';

/**
 * Build a concise error message from Supabase error objects.
 */
function toMessage(err) {
  const msg = err?.message || err?.error_description || err?.hint || 'Unknown error';
  const code = err?.code ? ` [${err.code}]` : '';
  return `${msg}${code}`;
}

/**
 * Normalize and validate an expense payload before sending to Supabase.
 * Ensures:
 * - user_id is present (required by RLS)
 * - date is provided (DB requires non-null)
 * - amount is a finite number
 * - nullable fields are set to null when empty
 * - id is never sent to the backend (DB generates UUID)
 */
function normalizeExpense(expense) {
  const e = { ...expense };
  // Never allow client-provided id to go to DB; let DB default generate it.
  if ('id' in e) delete e.id;

  if (!e.user_id) {
    throw new Error('Missing user_id on expense payload');
  }
  if (!e.date) {
    throw new Error('Missing date on expense payload');
  }
  const amt = Number(e.amount);
  if (!Number.isFinite(amt)) {
    throw new Error('Amount must be a number');
  }
  e.amount = amt;
  e.category_id = e.category_id || null;
  e.merchant = e.merchant || null;
  e.notes = e.notes || null;
  e.receipt_url = e.receipt_url || null;
  return e;
}

/**
 * Remove id from arbitrary payloads before writes.
 * Useful for callers that may accidentally include a temporary id.
 */
function stripId(obj) {
  const copy = { ...obj };
  if ('id' in copy) delete copy.id;
  return copy;
}

// PUBLIC_INTERFACE
export async function listExpenses({ userId, fromDate, toDate, categoryId }) {
  try {
    let q = supabase
      .from('expenses')
      .select('id,user_id,amount,category_id,merchant,notes,date,receipt_url')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(500);
    if (fromDate) q = q.gte('date', fromDate);
    if (toDate) q = q.lte('date', toDate);
    if (categoryId) q = q.eq('category_id', categoryId);
    const { data, error, status } = await q;
    if (status === 404) return [];
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('listExpenses error', e);
    // Return empty array but also attach info for caller if needed in future
    return [];
  }
}

// PUBLIC_INTERFACE
export async function createExpense(expense) {
  /**
   * PUBLIC_INTERFACE
   * Create an expense row. Any client-supplied id is removed to avoid UUID errors.
   * Returns the server-generated row including id via select('*').single().
   */
  try {
    const payload = normalizeExpense(stripId(expense));
    const { data, error } = await supabase
      .from('expenses')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    // Improve message to guide setup (RLS/table)
    const msg = toMessage(e);
    console.error('createExpense error', e);
    const hint = 'Ensure table "expenses" exists and RLS allows auth.uid() = user_id.';
    const wrapped = new Error(`Create expense failed: ${msg}. ${hint}`);
    wrapped.cause = e;
    throw wrapped;
  }
}

// PUBLIC_INTERFACE
export async function createExpenseSafe(expense) {
  /**
   * PUBLIC_INTERFACE
   * Create expense with validation against expected schema:
   * - amount: numeric
   * - user_id: required
   * - date: required (YYYY-MM-DD)
   * - category_id: nullable
   * - merchant/notes/receipt_url: nullable
   * Also ensures any client-provided id is stripped so DB generates a UUID.
   */
  try {
    const normalized = normalizeExpense(stripId(expense));
    const { data, error } = await supabase
      .from('expenses')
      .insert(normalized)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    const msg = toMessage(e);
    console.error('createExpenseSafe error', e);
    const wrapped = new Error(`Create expense failed: ${msg}`);
    wrapped.cause = e;
    throw wrapped;
  }
}

// PUBLIC_INTERFACE
export async function updateExpense(id, patch) {
  try {
    // Apply normalization to patch where applicable (but do not require user_id)
    const norm = { ...patch };
    if ('id' in norm) delete norm.id; // never update primary key
    if (norm.amount != null) {
      const amt = Number(norm.amount);
      if (!Number.isFinite(amt)) throw new Error('Amount must be a number');
      norm.amount = amt;
    }
    if (norm.category_id === '') norm.category_id = null;
    if (norm.merchant === '') norm.merchant = null;
    if (norm.notes === '') norm.notes = null;
    if (norm.receipt_url === '') norm.receipt_url = null;

    const { data, error } = await supabase.from('expenses').update(norm).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (e) {
    const msg = toMessage(e);
    console.error('updateExpense error', e);
    const wrapped = new Error(`Update expense failed: ${msg}`);
    wrapped.cause = e;
    throw wrapped;
  }
}

// PUBLIC_INTERFACE
export async function deleteExpense(id) {
  try {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('deleteExpense error', e);
    return false;
  }
}

// PUBLIC_INTERFACE
export async function sumExpensesByCategory({ userId, month }) {
  try {
    const start = `${month}-01`;
    const [yStr, mStr] = month.split('-');
    const y = parseInt(yStr, 10);
    const m0 = parseInt(mStr, 10) - 1;
    const endDate = new Date(y, m0 + 1, 0); // last day of target month
    const end = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from('expenses')
      .select('amount, category_id')
      .eq('user_id', userId)
      .gte('date', start)
      .lte('date', end);
    if (error) throw error;
    const map = {};
    (data || []).forEach((e) => {
      const k = e.category_id || 'uncategorized';
      map[k] = (map[k] || 0) + Number(e.amount || 0);
    });
    return map;
  } catch (e) {
    console.error('sumExpensesByCategory error', e?.message || e);
    return {};
  }
}

// PUBLIC_INTERFACE
export async function totalSpentInMonth({ userId, month }) {
  /**
   * PUBLIC_INTERFACE
   * Returns the numeric total spent for a given user within the provided month (YYYY-MM).
   * - Computes the month date range with actual last day via new Date(year, month+1, 0)
   * - Filters by user_id and date range
   * - Uses aggregate sum to avoid client-side summation overhead
   * - Safely returns 0 on empty/null results and logs errors
   */
  try {
    if (!userId) throw new Error('totalSpentInMonth requires userId');
    if (!month || !/^\d{4}-\d{2}$/.test(month)) throw new Error('totalSpentInMonth requires month in YYYY-MM');

    // Compute month range: start inclusive, end inclusive
    const start = `${month}-01`;
    const [yStr, mStr] = month.split('-');
    const y = parseInt(yStr, 10);
    const m0 = parseInt(mStr, 10) - 1; // zero-based for JS Date
    const endDate = new Date(y, m0 + 1, 0); // last day of target month in local time
    // Format YYYY-MM-DD; since Supabase compares dates (no timezone), this is fine
    const end = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

    // Perform an aggregate sum. supabase-js does not expose sum directly in select, but we can select a count expression.
    // Use PostgREST computed column selection with `sum(amount)` aliased as total.
    const { data, error } = await supabase
      .from('expenses')
      .select('total:sum(amount)')
      .eq('user_id', userId)
      .gte('date', start)
      .lte('date', end)
      .single();

    if (error) throw error;

    // data may be null or { total: null } when no rows match
    const total = Number(data?.total || 0);
    return Number.isFinite(total) ? total : 0;
  } catch (e) {
    // Surface detailed message to console; callers can toast if needed
    console.error('totalSpentInMonth error', e?.message || e);
    return 0;
  }
}

import { supabase } from '../lib/supabaseClient';

/**
 * Build a concise error message from Supabase error objects.
 */
function toMessage(err) {
  const msg = err?.message || err?.error_description || err?.hint || 'Unknown error';
  const code = err?.code ? ` [${err.code}]` : '';
  return `${msg}${code}`;
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
  // optimistic insert is left to the caller; this just forwards to DB
  try {
    const { data, error } = await supabase.from('expenses').insert(expense).select().single();
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
export async function updateExpense(id, patch) {
  try {
    const { data, error } = await supabase.from('expenses').update(patch).eq('id', id).select().single();
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
    const end = `${month}-31`;
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
    console.error('sumExpensesByCategory error', e);
    return {};
  }
}

// PUBLIC_INTERFACE
export async function totalSpentInMonth({ userId, month }) {
  try {
    const start = `${month}-01`;
    const end = `${month}-31`;
    const { data, error } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', userId)
      .gte('date', start)
      .lte('date', end);
    if (error) throw error;
    return (data || []).reduce((acc, x) => acc + Number(x.amount || 0), 0);
  } catch (e) {
    console.error('totalSpentInMonth error', e);
    return 0;
  }
}

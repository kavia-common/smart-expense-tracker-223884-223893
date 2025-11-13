import { supabase } from '../lib/supabaseClient';
import { totalSpentInMonth } from './expensesService';

/**
 * Detect if budgets table has budget_limit column.
 * We attempt a lightweight select on 0 rows to infer columns.
 */
async function budgetsUsesBudgetLimit() {
  try {
    // query with both columns; Supabase will error if unknown column referenced
    const { error } = await supabase
      .from('budgets')
      .select('id,budget_limit,limit')
      .limit(0);
    if (!error) {
      // If both exist, prefer budget_limit as canonical DB column
      return true;
    }
    // If error mentions budget_limit unknown but limit exists, fall back
    if (error && /column .*budget_limit.* does not exist/i.test(error.message)) {
      return false;
    }
    // If error mentions "limit" unknown but budget_limit exists, prefer budget_limit
    if (error && /column .*limit.* does not exist/i.test(error.message)) {
      return true;
    }
    // Default: assume legacy schema from docs uses "limit"
    return false;
  } catch {
    return false;
  }
}

/**
 * Normalize budget record from DB to app model:
 * Always expose { id, user_id, category_id, month, limit }
 */
function normalizeBudgetRow(row) {
  if (!row) return row;
  const limitValue =
    row.budget_limit != null
      ? Number(row.budget_limit)
      : row.limit != null
      ? Number(row.limit)
      : 0;
  const { budget_limit, ...rest } = row;
  return { ...rest, limit: limitValue };
}

// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * List budgets for a user, optionally filtered by month (YYYY-MM).
 * Supports DB schemas where the numeric column is either "limit" or "budget_limit".
 */
export async function listBudgets(userId, month) {
  try {
    const prefersBudgetLimit = await budgetsUsesBudgetLimit();
    const selectCols = prefersBudgetLimit
      ? 'id,user_id,category_id,month,budget_limit'
      : 'id,user_id,category_id,month,limit';

    let q = supabase.from('budgets').select(selectCols).eq('user_id', userId);
    if (month) q = q.eq('month', month);

    const { data, error, status } = await q;
    if (status === 404) {
      console.warn('Budgets table missing. Run docs/supabase_core_setup.sql to create budgets.');
      return [];
    }
    if (error) throw error;
    return (data || []).map(normalizeBudgetRow);
  } catch (e) {
    console.error('listBudgets error', e?.message);
    return [];
  }
}

/**
 * Prepare an insert/update payload for the current schema.
 * Accepts an object with limit and maps to either { budget_limit } or { limit }.
 */
async function mapLimitForWrite(payload) {
  const prefersBudgetLimit = await budgetsUsesBudgetLimit();
  const limitNumber = Number(payload.limit);
  const base = { ...payload };
  delete base.limit;
  if (prefersBudgetLimit) {
    return { ...base, budget_limit: limitNumber };
  }
  return { ...base, limit: limitNumber };
}

// PUBLIC_INTERFACE
export async function createBudget(budget) {
  try {
    const writePayload = await mapLimitForWrite(budget);
    const selectCols = await budgetsUsesBudgetLimit()
      ? 'id,user_id,category_id,month,budget_limit'
      : 'id,user_id,category_id,month,limit';
    const { data, error } = await supabase
      .from('budgets')
      .insert(writePayload)
      .select(selectCols)
      .single();
    if (error) throw error;
    return normalizeBudgetRow(data);
  } catch (e) {
    console.error('createBudget error', e?.message);
    throw e;
  }
}

// PUBLIC_INTERFACE
export async function updateBudget(id, patch) {
  try {
    const writePayload = await mapLimitForWrite(patch);
    const selectCols = await budgetsUsesBudgetLimit()
      ? 'id,user_id,category_id,month,budget_limit'
      : 'id,user_id,category_id,month,limit';
    const { data, error } = await supabase
      .from('budgets')
      .update(writePayload)
      .eq('id', id)
      .select(selectCols)
      .single();
    if (error) throw error;
    return normalizeBudgetRow(data);
  } catch (e) {
    console.error('updateBudget error', e?.message);
    throw e;
  }
}

// PUBLIC_INTERFACE
export async function deleteBudget(id) {
  try {
    const { error } = await supabase.from('budgets').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('deleteBudget error', e?.message);
    return false;
  }
}

// PUBLIC_INTERFACE
export async function computeUtilization({ userId, month, budgets }) {
  try {
    const total = await totalSpentInMonth({ userId, month });
    const byBudget = (budgets || []).map((b) => {
      const spent = b.spent ?? null; // If backend view/materialized, otherwise null
      const utilization = spent != null ? spent / b.limit : null;
      return { ...b, spent, utilization };
    });
    return { total, byBudget };
  } catch (e) {
    console.error('computeUtilization error', e?.message);
    return { total: 0, byBudget: [] };
  }
}

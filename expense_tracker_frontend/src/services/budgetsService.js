import { supabase } from '../lib/supabaseClient';
import { totalSpentInMonth } from './expensesService';

// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * List budgets for a user, optionally filtered by month (YYYY-MM).
 * Schema expected: budgets(id, user_id, category_id nullable, month text 'YYYY-MM', limit numeric)
 */
export async function listBudgets(userId, month) {
  try {
    let q = supabase
      .from('budgets')
      .select('id,user_id,category_id,month,limit')
      .eq('user_id', userId);
    if (month) q = q.eq('month', month);
    const { data, error, status } = await q;
    if (status === 404) {
      console.warn('Budgets table missing. Run docs/supabase_core_setup.sql to create budgets.');
      return [];
    }
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('listBudgets error', e?.message);
    return [];
  }
}

// PUBLIC_INTERFACE
export async function createBudget(budget) {
  try {
    const { data, error } = await supabase.from('budgets').insert(budget).select().single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('createBudget error', e?.message);
    throw e;
  }
}

// PUBLIC_INTERFACE
export async function updateBudget(id, patch) {
  try {
    const { data, error } = await supabase.from('budgets').update(patch).eq('id', id).select().single();
    if (error) throw error;
    return data;
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

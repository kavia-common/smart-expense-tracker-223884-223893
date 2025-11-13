import { supabase } from '../lib/supabaseClient';

const table = 'categories';

// PUBLIC_INTERFACE
export async function listCategories(userId) {
  try {
    const { data, error, status } = await supabase
      .from(table)
      .select('id,name,color')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (status === 404) {
      console.warn('Categories table missing. Run docs/supabase_core_setup.sql to create categories.');
      return [];
    }
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('listCategories error', e?.message);
    return [];
  }
}

// PUBLIC_INTERFACE
export async function ensureDefaultCategories(userId) {
  // No-op if already present; attempt insert default categories
  const defaults = [
    { name: 'Food', color: '#2563EB' },
    { name: 'Transport', color: '#F59E0B' },
    { name: 'Shopping', color: '#10b981' },
    { name: 'Bills', color: '#EF4444' }
  ];
  try {
    const current = await listCategories(userId);
    if (current.length > 0) return current;

    // Try to insert defaults. If table missing (404/42P01), return gracefully with guidance.
    const toInsert = defaults.map((c) => ({ ...c, user_id: userId }));
    const { data, error, status } = await supabase.from(table).insert(toInsert).select();

    if (status === 404 || (error && (error.code === '42P01' || /relation .* does not exist/i.test(error.message)))) {
      console.warn('Categories table not found. Please run docs/supabase_core_setup.sql to create tables.');
      return [];
    }
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn('ensureDefaultCategories failed', e?.message);
    return [];
  }
}

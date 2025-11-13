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

    if (status === 404) return [];
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
    const toInsert = defaults.map((c) => ({ ...c, user_id: userId }));
    const { data, error } = await supabase.from(table).insert(toInsert).select();
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn('ensureDefaultCategories failed', e?.message);
    return [];
  }
}

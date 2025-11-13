import { supabase } from '../lib/supabaseClient';

// PUBLIC_INTERFACE
export async function getProfile(userId) {
  try {
    const { data, error, status } = await supabase.from('profiles').select('id,display_name').eq('id', userId).single();
    if (status === 406 || status === 404) return null;
    if (error) throw error;
    return data || null;
  } catch (e) {
    console.error('getProfile error', e?.message);
    return null;
  }
}

// PUBLIC_INTERFACE
export async function upsertProfile({ id, display_name }) {
  try {
    const { data, error } = await supabase.from('profiles').upsert({ id, display_name }).select().single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('upsertProfile error', e?.message);
    throw e;
  }
}

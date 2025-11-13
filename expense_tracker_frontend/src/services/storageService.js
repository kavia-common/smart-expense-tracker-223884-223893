import { supabase } from '../lib/supabaseClient';

const BUCKET = 'receipts';

// PUBLIC_INTERFACE
export async function uploadReceipt(file, userId) {
  if (!file) return null;
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  try {
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/jpeg'
    });
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return publicUrlData?.publicUrl || null;
  } catch (e) {
    console.error('uploadReceipt error', e?.message);
    throw e;
  }
}

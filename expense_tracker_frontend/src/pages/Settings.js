import React, { useEffect, useState } from 'react';
import { getProfile, upsertProfile } from '../services/profileService';
import { useToast } from '../components/Toast';

// PUBLIC_INTERFACE
export default function SettingsPage({ session }) {
  const { show } = useToast();
  const userId = session?.user?.id;
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const p = await getProfile(userId);
      if (!active) return;
      setDisplayName(p?.display_name || '');
      setLoading(false);
    })();
    return () => { active = false; };
  }, [userId]);

  async function onSave(e) {
    e.preventDefault();
    try {
      await upsertProfile({ id: userId, display_name: displayName });
      show('success', 'Profile saved');
    } catch (e1) {
      show('error', e1?.message || 'Save failed');
    }
  }

  return (
    <div>
      <h2>Settings</h2>
      <div className="card" style={{ padding: 14, maxWidth: 520 }}>
        <form onSubmit={onSave}>
          <label className="label" htmlFor="name">Display name</label>
          <input id="name" className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={loading} />
          <div style={{ height: 10 }} />
          <button className="btn" type="submit" disabled={loading}>Save</button>
        </form>
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { createBudget, deleteBudget, listBudgets, updateBudget } from '../services/budgetsService';
import { listCategories } from '../services/categoriesService';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import { sumExpensesByCategory } from '../services/expensesService';

// PUBLIC_INTERFACE
export default function BudgetsPage({ session }) {
  const { show } = useToast();
  const userId = session?.user?.id;
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [spentMap, setSpentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ category_id: '', limit: '' });

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const cats = await listCategories(userId);
      const b = await listBudgets(userId, month);
      const sm = await sumExpensesByCategory({ userId, month });
      if (!active) return;
      setCategories(cats);
      setBudgets(b);
      setSpentMap(sm);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [userId, month]);

  function categoryName(id) {
    return categories.find((c) => c.id === id)?.name || 'All';
  }

  function openCreate() {
    setEditing(null);
    setForm({ category_id: '', limit: '' });
    setOpen(true);
  }

  function openEdit(b) {
    setEditing(b);
    setForm({ category_id: b.category_id || '', limit: String(b.limit) });
    setOpen(true);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const payload = {
      user_id: userId,
      month,
      category_id: form.category_id || null,
      limit: Number(form.limit)
    };
    try {
      if (editing) {
        const updated = await updateBudget(editing.id, payload);
        setBudgets((prev) => prev.map((x) => (x.id === editing.id ? updated : x)));
        show('success', 'Budget updated');
      } else {
        const optimistic = { id: `tmp-${Date.now()}`, ...payload };
        setBudgets((p) => [optimistic, ...p]);
        try {
          const created = await createBudget(payload);
          setBudgets((p) => p.map((x) => (x.id === optimistic.id ? created : x)));
          show('success', 'Budget added');
        } catch {
          show('error', 'Failed to add budget. Refreshing.');
          const b = await listBudgets(userId, month);
          setBudgets(b);
        }
      }
      setOpen(false);
    } catch (e1) {
      show('error', e1?.message || 'Operation failed');
    }
  }

  async function onDelete(id) {
    const ok = window.confirm('Delete this budget?');
    if (!ok) return;
    const prev = budgets;
    setBudgets((p) => p.filter((x) => x.id !== id));
    const success = await deleteBudget(id);
    if (!success) {
      setBudgets(prev);
      show('error', 'Delete failed');
    } else {
      show('success', 'Deleted');
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Budgets</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="month" className="input" value={month} onChange={(e) => setMonth(e.target.value)} />
          <button className="btn" onClick={openCreate}>Add budget</button>
        </div>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr><th>Category</th><th>Limit</th><th>Spent</th><th>Utilization</th><th></th></tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={5}><div className="skeleton" style={{ height: 16 }} /></td></tr>
              ))
            ) : (
              budgets.map((b) => {
                const spent = Number(spentMap[b.category_id || 'uncategorized'] || 0);
                const util = b.limit ? spent / b.limit : 0;
                let barColor = 'var(--primary)';
                if (util >= 1) barColor = 'var(--error)';
                else if (util >= 0.8) barColor = 'var(--secondary)';
                return (
                  <tr key={b.id}>
                    <td>{categoryName(b.category_id)}</td>
                    <td>${Number(b.limit).toFixed(2)}</td>
                    <td>${spent.toFixed(2)}</td>
                    <td style={{ width: 300 }}>
                      <div className="progress">
                        <div style={{ width: `${Math.min(util * 100, 100)}%`, background: barColor }} />
                      </div>
                      <div className="helper">{Math.round(util * 100)}%</div>
                    </td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button className="btn ghost" onClick={() => openEdit(b)}>Edit</button>
                      <button className="btn ghost" onClick={() => onDelete(b.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })
            )}
            {!loading && budgets.length === 0 && (
              <tr><td colSpan={5} style={{ color: '#6b7280' }}>No budgets yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit budget' : 'Add budget'}>
        <form onSubmit={onSubmit}>
          <label className="label" htmlFor="cat">Category</label>
          <select id="cat" className="select" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
            <option value="">All (overall budget)</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div style={{ height: 8 }} />
          <label className="label" htmlFor="limit">Monthly limit</label>
          <input id="limit" type="number" step="0.01" min="0" className="input" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} required />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <button className="btn ghost" type="button" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn" type="submit">{editing ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

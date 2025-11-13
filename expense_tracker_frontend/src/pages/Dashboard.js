import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import { createExpense, listExpenses, totalSpentInMonth } from '../services/expensesService';
import { listBudgets } from '../services/budgetsService';
import { ensureDefaultCategories, listCategories } from '../services/categoriesService';

// PUBLIC_INTERFACE
export default function DashboardPage({ session }) {
  const { show } = useToast();
  const userId = session?.user?.id;
  const [month] = useState(() => new Date().toISOString().slice(0, 7));
  const [categories, setCategories] = useState([]);
  const [recent, setRecent] = useState([]);
  const [spent, setSpent] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ amount: '', date: new Date().toISOString().slice(0, 10), merchant: '', category_id: '' });
  const [loading, setLoading] = useState(true);

  const remaining = useMemo(() => {
    const totalLimit = budgets.reduce((acc, b) => acc + Number(b.limit || 0), 0);
    return Math.max(0, totalLimit - spent);
  }, [budgets, spent]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const cats = await ensureDefaultCategories(userId);
      const rec = await listExpenses({ userId });
      const sp = await totalSpentInMonth({ userId, month });
      const b = await listBudgets(userId, month);
      if (!active) return;
      setCategories(cats);
      setRecent(rec.slice(0, 5));
      setSpent(sp);
      setBudgets(b);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [userId, month]);

  async function addQuickExpense(e) {
    e.preventDefault();
    if (!Number(form.amount) || !form.date) {
      show('error', 'Amount and date are required');
      return;
    }
    try {
      const optimistic = {
        id: `tmp-${Date.now()}`,
        user_id: userId,
        amount: Number(form.amount),
        category_id: form.category_id || null,
        merchant: form.merchant || null,
        date: form.date,
        notes: null,
        receipt_url: null
      };
      setRecent((prev) => [optimistic, ...prev].slice(0, 5));
      setAdding(false);
      setForm({ amount: '', date: new Date().toISOString().slice(0, 10), merchant: '', category_id: '' });
      await createExpense(optimistic);
      show('success', 'Expense added');
      // Refetch recent/spent lightly
      const rec = await listExpenses({ userId });
      const sp = await totalSpentInMonth({ userId, month });
      setRecent(rec.slice(0, 5));
      setSpent(sp);
    } catch (e) {
      show('error', 'Failed to add expense');
    }
  }

  return (
    <div>
      <h2>Dashboard</h2>
      {loading ? (
        <div className="grid kpis">
          <div className="card" style={{ padding: 16 }}><div className="skeleton" style={{ height: 20, width: '60%' }} /></div>
          <div className="card" style={{ padding: 16 }}><div className="skeleton" style={{ height: 20, width: '50%' }} /></div>
          <div className="card" style={{ padding: 16 }}><div className="skeleton" style={{ height: 20, width: '70%' }} /></div>
          <div className="card" style={{ padding: 16 }}><div className="skeleton" style={{ height: 20, width: '40%' }} /></div>
        </div>
      ) : (
        <>
          <div className="grid kpis">
            <div className="card" style={{ padding: 16 }}>
              <div className="label">Total spent this month</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>${spent.toFixed(2)}</div>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div className="label">Remaining budget</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>${remaining.toFixed(2)}</div>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div className="label">Budgets</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{budgets.length}</div>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div className="label">Quick actions</div>
              <button className="btn" onClick={() => setAdding(true)} data-testid="quick-add-expense">Add expense</button>
            </div>
          </div>

          <div style={{ height: 16 }} />
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Recent expenses</h3>
              <button className="btn ghost" onClick={async () => setRecent(await listExpenses({ userId }))}>Refresh</button>
            </div>
            <table className="table">
              <thead>
                <tr><th>Date</th><th>Merchant</th><th>Category</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {recent.map((e) => {
                  const cat = categories.find((c) => c.id === e.category_id)?.name || '—';
                  return (
                    <tr key={e.id}>
                      <td>{new Date(e.date).toLocaleDateString()}</td>
                      <td>{e.merchant || '—'}</td>
                      <td>{cat}</td>
                      <td>${Number(e.amount).toFixed(2)}</td>
                    </tr>
                  );
                })}
                {recent.length === 0 && (
                  <tr><td colSpan={4} style={{ color: '#6b7280' }}>No expenses yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="Add expense">
        <form onSubmit={addQuickExpense}>
          <label className="label" htmlFor="amount">Amount</label>
          <input id="amount" className="input" type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <div style={{ height: 10 }} />
          <label className="label" htmlFor="date">Date</label>
          <input id="date" className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <div style={{ height: 10 }} />
          <label className="label" htmlFor="merchant">Merchant</label>
          <input id="merchant" className="input" value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} />
          <div style={{ height: 10 }} />
          <label className="label" htmlFor="category">Category</label>
          <select id="category" className="select" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
            <option value="">Uncategorized</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <button type="button" className="btn ghost" onClick={() => setAdding(false)}>Cancel</button>
            <button type="submit" className="btn">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

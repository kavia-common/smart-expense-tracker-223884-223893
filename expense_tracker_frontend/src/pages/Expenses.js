import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import { createExpenseSafe, deleteExpense, listExpenses, updateExpense } from '../services/expensesService';
import { listCategories } from '../services/categoriesService';
import { uploadReceipt } from '../services/storageService';

// PUBLIC_INTERFACE
export default function ExpensesPage({ session }) {
  const { show } = useToast();
  const userId = session?.user?.id;
  const [filters, setFilters] = useState({ fromDate: '', toDate: '', categoryId: '' });
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ amount: '', date: new Date().toISOString().slice(0, 10), merchant: '', category_id: '', notes: '' });

  const filteredCount = useMemo(() => items.length, [items]);

  async function fetchAll() {
    setLoading(true);
    const cats = await listCategories(userId);
    const exps = await listExpenses({ userId, ...filters });
    setCategories(cats);
    setItems(exps);
    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function applyFilters(e) {
    e?.preventDefault?.();
    await fetchAll();
  }

  function openCreate() {
    setEditing(null);
    setForm({ amount: '', date: new Date().toISOString().slice(0, 10), merchant: '', category_id: '', notes: '' });
    setFile(null);
    setModalOpen(true);
  }

  function openEdit(exp) {
    setEditing(exp);
    setForm({
      amount: String(exp.amount),
      date: exp.date.slice(0, 10),
      merchant: exp.merchant || '',
      category_id: exp.category_id || '',
      notes: exp.notes || ''
    });
    setFile(null);
    setModalOpen(true);
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const amt = Number(form.amount);
      if (!Number.isFinite(amt) || amt < 0) {
        show('error', 'Please enter a valid non-negative amount');
        return;
      }
      let receipt_url = editing?.receipt_url || null;
      if (file) {
        receipt_url = await uploadReceipt(file, userId);
      }
      if (editing) {
        const updated = await updateExpense(editing.id, {
          amount: amt,
          date: form.date,
          merchant: form.merchant || null,
          category_id: form.category_id || null,
          notes: form.notes || null,
          receipt_url
        });
        setItems((prev) => prev.map((x) => (x.id === editing.id ? updated : x)));
        show('success', 'Expense updated');
      } else {
        const tmpId = `tmp-${Date.now()}`;
        const optimistic = {
          id: tmpId, // keep in UI only
          user_id: userId,
          amount: amt,
          date: form.date,
          merchant: form.merchant || null,
          category_id: form.category_id || null,
          notes: form.notes || null,
          receipt_url
        };
        setItems((prev) => [optimistic, ...prev]);
        try {
          // Build payload without id for DB
          const payload = {
            user_id: userId,
            amount: optimistic.amount,
            date: optimistic.date,
            merchant: optimistic.merchant,
            category_id: optimistic.category_id,
            notes: optimistic.notes,
            receipt_url: optimistic.receipt_url
          };
          const created = await createExpenseSafe(payload);
          setItems((prev) => prev.map((x) => (x.id === optimistic.id ? created : x)));
          show('success', 'Expense added');
        } catch (err) {
          const msg = err?.message || 'Failed to add expense. Refreshing list.';
          show('error', msg);
          await fetchAll();
        }
      }
      setModalOpen(false);
    } catch (e1) {
      show('error', e1?.message || 'Operation failed');
    }
  }

  async function onDelete(id) {
    const ok = window.confirm('Delete this expense?');
    if (!ok) return;
    const prev = items;
    setItems((p) => p.filter((x) => x.id !== id));
    const success = await deleteExpense(id);
    if (!success) {
      setItems(prev);
      show('error', 'Delete failed');
    } else {
      show('success', 'Deleted');
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Expenses</h2>
        <button className="btn" onClick={openCreate} data-testid="add-expense">Add</button>
      </div>
      <form onSubmit={applyFilters} className="card" style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          <div>
            <label className="label" htmlFor="from">From</label>
            <input id="from" type="date" className="input" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="to">To</label>
            <input id="to" type="date" className="input" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="cat">Category</label>
            <select id="cat" className="select" value={filters.categoryId} onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}>
              <option value="">All</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'end', gap: 8 }}>
            <button className="btn ghost" type="button" onClick={() => setFilters({ fromDate: '', toDate: '', categoryId: '' })}>Reset</button>
            <button className="btn" type="submit">Apply</button>
          </div>
        </div>
      </form>
      <div className="card" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Merchant</th><th>Category</th><th>Amount</th><th>Receipt</th><th></th></tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6}><div className="skeleton" style={{ height: 16 }} /></td></tr>
              ))
            ) : (
              items.map((e) => {
                const cat = categories.find((c) => c.id === e.category_id)?.name || '—';
                return (
                  <tr key={e.id}>
                    <td>{new Date(e.date).toLocaleDateString()}</td>
                    <td>{e.merchant || '—'}</td>
                    <td>{cat}</td>
                    <td>${Number(e.amount).toFixed(2)}</td>
                    <td>
                      {e.receipt_url ? (
                        <a href={e.receipt_url} target="_blank" rel="noreferrer">View</a>
                      ) : '—'}
                    </td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button className="btn ghost" onClick={() => openEdit(e)}>Edit</button>
                      <button className="btn ghost" onClick={() => onDelete(e.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })
            )}
            {!loading && filteredCount === 0 && (
              <tr><td colSpan={6} style={{ color: '#6b7280' }}>No expenses found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit expense' : 'Add expense'}>
        <form onSubmit={onSubmit}>
          <label className="label" htmlFor="amount">Amount</label>
          <input id="amount" className="input" type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <div style={{ height: 8 }} />
          <label className="label" htmlFor="date">Date</label>
          <input id="date" className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <div style={{ height: 8 }} />
          <label className="label" htmlFor="merchant">Merchant</label>
          <input id="merchant" className="input" value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} />
          <div style={{ height: 8 }} />
          <label className="label" htmlFor="cat">Category</label>
          <select id="cat" className="select" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
            <option value="">Uncategorized</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div style={{ height: 8 }} />
          <label className="label" htmlFor="notes">Notes</label>
          <textarea id="notes" className="textarea" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div style={{ height: 8 }} />
          <label className="label" htmlFor="receipt">Receipt</label>
          <input id="receipt" className="input" type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div className="helper">Upload an image or PDF of your receipt (optional)</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <button type="button" className="btn ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn">{editing ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

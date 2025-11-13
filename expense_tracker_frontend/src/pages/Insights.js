import React, { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { listCategories } from '../services/categoriesService';
import { listExpenses } from '../services/expensesService';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

// PUBLIC_INTERFACE
export default function InsightsPage({ session }) {
  const userId = session?.user?.id;
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const cats = await listCategories(userId);
      const exps = await listExpenses({ userId });
      if (!active) return;
      setCategories(cats);
      setExpenses(exps);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [userId]);

  const byCategory = (() => {
    const map = {};
    expenses.forEach((e) => {
      const k = e.category_id || 'uncategorized';
      map[k] = (map[k] || 0) + Number(e.amount || 0);
    });
    const labels = Object.keys(map).map((k) => categories.find((c) => c.id === k)?.name || 'Uncategorized');
    const values = Object.values(map);
    const colors = Object.keys(map).map((k, i) => categories.find((c) => c.id === k)?.color || ['#2563EB', '#F59E0B', '#10b981', '#EF4444', '#6366f1'][i % 5]);
    return { labels, values, colors };
  })();

  const byDate = (() => {
    const map = {};
    expenses.forEach((e) => {
      const d = e.date.slice(0, 10);
      map[d] = (map[d] || 0) + Number(e.amount || 0);
    });
    const labels = Object.keys(map).sort();
    const values = labels.map((d) => map[d]);
    return { labels, values };
  })();

  return (
    <div>
      <h2>Insights</h2>
      {loading ? (
        <div className="skeleton" style={{ height: 220 }} />
      ) : (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="card" style={{ padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>Spending by category</h3>
            <Pie
              data={{
                labels: byCategory.labels,
                datasets: [{ data: byCategory.values, backgroundColor: byCategory.colors }]
              }}
            />
          </div>
          <div className="card" style={{ padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>Spending over time</h3>
            <Line
              data={{
                labels: byDate.labels,
                datasets: [{ data: byDate.values, label: 'Daily spend', fill: false, borderColor: '#2563EB' }]
              }}
              options={{ responsive: true, maintainAspectRatio: true }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

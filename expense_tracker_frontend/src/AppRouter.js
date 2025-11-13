import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import './theme/global.css';
import { ToastProvider, useToast } from './components/Toast';

import DashboardPage from './pages/Dashboard';
import ExpensesPage from './pages/Expenses';
import BudgetsPage from './pages/Budgets';
import ReceiptsPage from './pages/Receipts';
import InsightsPage from './pages/Insights';
import SettingsPage from './pages/Settings';
import AuthPage from './pages/Auth';

function Shell({ children, session }) {
  const { show } = useToast();
  const [profileName, setProfileName] = useState('');

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) show('success', 'Signed out');
    });
    return () => sub?.data?.subscription?.unsubscribe?.();
  }, [show]);

  useEffect(() => {
    setProfileName(session?.user?.email || 'You');
  }, [session]);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span role="img" aria-label="wave">🌊</span>
          <span>Ocean Expenses</span>
        </div>
        <nav>
          <NavLink className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`} to="/dashboard">Dashboard</NavLink>
          <NavLink className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`} to="/expenses">Expenses</NavLink>
          <NavLink className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`} to="/budgets">Budgets</NavLink>
          <NavLink className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`} to="/receipts">Receipts</NavLink>
          <NavLink className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`} to="/insights">Insights</NavLink>
          <NavLink className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`} to="/settings">Settings</NavLink>
        </nav>
      </aside>
      <main>
        <div className="topbar">
          <div style={{ fontWeight: 700 }}>Welcome, {profileName}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn ghost"
              onClick={async () => {
                await supabase.auth.signOut();
              }}
            >
              Log out
            </button>
          </div>
        </div>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}

function ProtectedRoute({ session, children }) {
  if (!session) return <Navigate to="/auth" replace />;
  return children;
}

function AppInner() {
  const [session, setSession] = useState(null);
  const loading = useMemo(() => session === undefined, [session]);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess || null);
    });
    return () => {
      active = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute session={session}>
              <Shell session={session}>
                <DashboardPage session={session} />
              </Shell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute session={session}>
              <Shell session={session}>
                <DashboardPage session={session} />
              </Shell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute session={session}>
              <Shell session={session}>
                <ExpensesPage session={session} />
              </Shell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <ProtectedRoute session={session}>
              <Shell session={session}>
                <BudgetsPage session={session} />
              </Shell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipts"
          element={
            <ProtectedRoute session={session}>
              <Shell session={session}>
                <ReceiptsPage session={session} />
              </Shell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <ProtectedRoute session={session}>
              <Shell session={session}>
                <InsightsPage session={session} />
              </Shell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute session={session}>
              <Shell session={session}>
                <SettingsPage session={session} />
              </Shell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// PUBLIC_INTERFACE
export default function AppRouter() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}

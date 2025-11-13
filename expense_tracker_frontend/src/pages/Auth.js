import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

// PUBLIC_INTERFACE
export default function AuthPage() {
  const { show } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const valid = email.includes('@') && password.length >= 6;

  async function onSubmit(e) {
    e.preventDefault();
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        show('success', 'Signed in');
        navigate('/dashboard');
      } else {
        // PUBLIC_INTERFACE
        const redirectTo = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo }
        });
        if (error) throw error;
        show('success', 'Signup successful. Check your email to confirm.');
      }
    } catch (e) {
      show('error', e?.message || 'Authentication failed');
    }
  }

  async function onReset() {
    if (!email) {
      show('error', 'Enter email to reset password');
      return;
    }
    try {
      const redirectTo = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      show('success', 'Password reset email sent');
    } catch (e) {
      show('error', e?.message || 'Password reset failed');
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '10vh auto', padding: 18 }} className="card">
      <h2 style={{ marginTop: 0, marginBottom: 6 }}>{mode === 'signin' ? 'Sign in' : 'Create account'}</h2>
      <p style={{ color: '#6b7280', marginTop: 0 }}>Welcome to Ocean Expenses</p>
      <form onSubmit={onSubmit} data-testid="auth-form">
        <label className="label" htmlFor="email">Email</label>
        <input
          id="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <div style={{ height: 12 }} />
        <label className="label" htmlFor="password">Password</label>
        <input
          id="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          placeholder="••••••••"
          minLength={6}
          required
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <button
            type="button"
            className="btn ghost"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            data-testid="toggle-auth-mode"
          >
            {mode === 'signin' ? 'Create account' : 'Have an account? Sign in'}
          </button>
          <button className="btn" type="submit" disabled={!valid} data-testid="submit-auth">
            {mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </form>
      <div style={{ marginTop: 10 }}>
        <button className="btn ghost" onClick={onReset} data-testid="password-reset">Forgot password?</button>
      </div>
    </div>
  );
}

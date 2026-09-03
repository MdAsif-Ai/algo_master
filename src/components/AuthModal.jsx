import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthModal({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuthSuccess(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // If email confirmation is disabled in Supabase, user is auto-signed in
        if (data.user && data.user.identities && data.user.identities.length > 0) {
          setMessage('Account created! You are now logged in.');
          onAuthSuccess(data.user);
        } else {
          setMessage('Account created! Please check your email to confirm your account, then log in.');
          setMode('login');
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">⚡</div>
          <h1 className="auth-title">AlgoMaster</h1>
          <p className="auth-subtitle">Your personal DSA preparation tracker</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); setMessage(''); }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); setMessage(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign In to AlgoMaster'
                : 'Create My Account'}
          </button>
        </form>

        {/* Footer */}
        <p className="auth-footer">
          {mode === 'login'
            ? <>Don't have an account? <button onClick={() => setMode('signup')}>Sign up free</button></>
            : <>Already have an account? <button onClick={() => setMode('login')}>Sign in</button></>
          }
        </p>

        <p className="auth-note">
          Your progress, solutions, and notes are securely stored in the cloud via Supabase.
        </p>
      </div>
    </div>
  );
}

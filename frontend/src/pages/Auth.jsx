import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, ArrowRight } from 'lucide-react';
import Pill from '../components/Pill.jsx';
import Brand from '../components/Brand.jsx';
import api from '../services/api.js';

function Auth({ onAuth, mode = 'login' }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setError('');
  }, [mode]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must have at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      const data = await api(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify(
          mode === 'register'
            ? { name, email, password, role }
            : { email, password }
        ),
      });
      onAuth(data);
      navigate(data.user.role === 'owner' ? '/dashboard' : '/explore');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-layout">
      <div className="auth-aside">
        <Link to="/" className="auth-back">
          <ChevronLeft size={18} /> Back to home
        </Link>
        <div>
          <Pill light>YOUR NEW HOME AWAITS</Pill>
          <h2>
            Great spaces
            <br />
            <em>New beginnings</em>
          </h2>
          <p>
            Join students and owners who believe finding a home should feel
            effortless
          </p>
        </div>
        <span className="auth-aside-caption">
          <Sparkles size={16} /> A simpler way to settle in.
        </span>
      </div>
      <div className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <Brand />
          </div>
          <h1>{mode === 'login' ? 'Welcome back' : 'Let’s get you started'}</h1>
          <p>
            {mode === 'login'
              ? 'Sign in to continue your BoardEase journey.'
              : 'Create your account and find your perfect fit.'}
          </p>
          <form className="auth-form" onSubmit={submit}>
            {mode === 'register' && (
              <label>
                Full name
                <input
                  required
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            )}
            <label>
              Email address
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password
              <input
                required
                minLength={6}
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {mode === 'register' && (
              <label>
                I'm joining as
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="student">
                    Student / Looking for a boarding
                  </option>
                  <option value="owner">
                    Boarding owner / Listing a property
                  </option>
                </select>
              </label>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button
              className="btn btn-dark btn-full"
              disabled={busy}
              type="submit"
            >
              {busy
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Log in'
                  : 'Create account'}{' '}
              <ArrowRight size={17} />
            </button>
          </form>
          <p className="auth-switch">
            {mode === 'login' ? (
              <>
                New to BoardEase? <Link to="/register">Create an account</Link>
              </>
            ) : (
              <>
                Already have an account? <Link to="/login">Log in</Link>
              </>
            )}
          </p>
        </div>
      </div>
    </main>
  );
}

export default Auth;

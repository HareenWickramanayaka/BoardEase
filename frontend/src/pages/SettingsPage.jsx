import React, { useState } from 'react';
import { UserRound, Moon, Sun, ShieldCheck, Check, LogOut } from 'lucide-react';
import Pill from '../components/Pill.jsx';
import api from '../services/api.js';

function SettingsPage({ user, onUserChange, theme, setTheme, logout }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function saveProfile(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const updated = await api('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, email }),
      });
      onUserChange(updated.user);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      await api('/auth/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword: password }),
      });
      setPassword('');
      setCurrentPassword('');
      setMessage('Password changed successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-width inner-page settings-page">
      <div className="inner-heading">
        <Pill>YOUR ACCOUNT</Pill>
        <h1>
          Profile & <em>settings</em>
        </h1>
        <p>Keep your account details and preferences up to date</p>
      </div>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="settings-success">
          {message}
        </p>
      )}
      <div className="settings-grid">
        <section className="settings-card">
          <div className="settings-heading">
            <UserRound size={22} />
            <div>
              <h2>Personal information</h2>
              <p>Edit your profile details</p>
            </div>
          </div>
          <form className="settings-form" onSubmit={saveProfile}>
            <label>
              Full name
              <input
                required
                minLength={2}
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Email address
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Account type
              <input
                disabled
                value={user.role === 'owner' ? 'Boarding owner' : 'Student'}
              />
            </label>
            <button type="submit" disabled={saving} className="btn btn-dark">
              {saving ? 'Saving...' : 'Save profile'}
            </button>
          </form>
        </section>
        <div className="settings-column">
          <section className="settings-card">
            <div className="settings-heading">
              <Moon size={22} />
              <div>
                <h2>Appearance</h2>
                <p>Choose your preferred display mode</p>
              </div>
            </div>
            <div className="theme-options">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={theme === 'light' ? 'selected' : ''}
              >
                <Sun size={19} /> Light{' '}
                {theme === 'light' && <Check size={17} />}
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={theme === 'dark' ? 'selected' : ''}
              >
                <Moon size={19} /> Dark{' '}
                {theme === 'dark' && <Check size={17} />}
              </button>
            </div>
          </section>
          <section className="settings-card">
            <div className="settings-heading">
              <ShieldCheck size={22} />
              <div>
                <h2>Security</h2>
                <p>Update your account password</p>
              </div>
            </div>
            <form className="settings-form" onSubmit={changePassword}>
              <label>
                Current password
                <input
                  required
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </label>
              <label>
                New password (at least 6 characters)
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-outline"
              >
                {saving ? 'Saving...' : 'Change password'}
              </button>
            </form>
          </section>
          {logout && (
            <section className="settings-card" style={{ marginTop: '20px' }}>
              <div className="settings-heading">
                <LogOut size={22} />
                <div>
                  <h2>Account session</h2>
                  <p>Sign out of your account on this device</p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-subtle logout-btn"
                onClick={logout}
                style={{ width: '100%', marginTop: '10px' }}
              >
                <LogOut size={16} /> Log out of BoardEase
              </button>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default SettingsPage;

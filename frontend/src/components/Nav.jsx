import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, LogOut, ArrowUpRight } from 'lucide-react';
import Brand from './Brand.jsx';

function Nav({ user, logout, theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  return (
    <header className="nav-wrap">
      <nav className="navbar page-width">
        <Brand />
        <button
          className="mobile-menu icon-button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <div className={`nav-links ${open ? 'show' : ''}`}>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/explore">Explore spaces</NavLink>
          <NavLink to="/about">How it works</NavLink>
          {user?.role === 'student' && (
            <>
              <NavLink to="/favorites">Saved homes</NavLink>
              <NavLink to="/requests">My requests</NavLink>
            </>
          )}
          {user?.role === 'owner' && (
            <NavLink to="/dashboard">My dashboard</NavLink>
          )}
          {user && <NavLink to="/settings">Profile & settings</NavLink>}
        </div>
        <div className={`nav-actions ${open ? 'show' : ''}`}>
          <button
            className="icon-button theme-toggle"
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          {user ? (
            <>
              <span className="welcome-name">
                Hi, {user.name.split(' ')[0]}
              </span>
              <button className="btn btn-subtle btn-sm logout-btn" onClick={logout} aria-label="Log out of account">
                <LogOut size={16} /> Log out
              </button>
            </>
          ) : (
            <>
              <Link className="login-link" to="/login">
                Log in
              </Link>
              <Link className="btn btn-dark btn-sm" to="/register">
                Get started <ArrowUpRight size={16} />
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Nav;

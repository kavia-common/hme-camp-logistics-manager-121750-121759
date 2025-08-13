import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';

import Dashboard from './pages/Dashboard';
import People from './pages/People';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Accommodations from './pages/Accommodations';
import Jobs from './pages/Jobs';
import Dues from './pages/Dues';
import Food from './pages/Food';
import Calendar from './pages/Calendar';
import InviteSignup from './pages/InviteSignup';
import AuthCallback from './pages/AuthCallback';
import { AuthProvider, useAuth } from './context/AuthContext';

// Small icon mapper using emojis to avoid extra icon packages
const icons = {
  dashboard: '🏜️',
  people: '🧑‍🤝‍🧑',
  profile: '👤',
  accommodations: '⛺',
  jobs: '🛠️',
  dues: '💰',
  food: '🍽️',
  calendar: '📅',
  admin: '⚙️',
};

// PUBLIC_INTERFACE
function Sidebar({ onClose, isOpen }) {
  /** Sidebar navigation component, responsive and collapsible */
  const { user } = useAuth();
  const navItems = useMemo(() => ([
    { to: '/', label: 'Dashboard', key: 'dashboard', icon: icons.dashboard },
    { to: '/people', label: 'People', key: 'people', icon: icons.people },
    { to: '/profile', label: 'My Profile', key: 'profile', icon: icons.profile },
    { to: '/accommodations', label: 'Accommodations', key: 'accommodations', icon: icons.accommodations },
    { to: '/jobs', label: 'Jobs', key: 'jobs', icon: icons.jobs },
    { to: '/dues', label: 'Dues & Payment', key: 'dues', icon: icons.dues },
    { to: '/food', label: 'Food', key: 'food', icon: icons.food },
    { to: '/calendar', label: 'Calendar', key: 'calendar', icon: icons.calendar },
    ...(user?.isAdmin ? [{ to: '/admin', label: 'Admin Panel', key: 'admin', icon: icons.admin }] : []),
  ]), [user]);

  const className = `sidebar ${isOpen ? 'open' : ''}`;

  return (
    <aside className={className} aria-label="Sidebar Navigation">
      <div className="brand">
        <span className="dot" />
        HME Camp
      </div>
      <nav className="nav">
        {navItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => isActive ? 'active' : undefined}
            onClick={onClose}
          >
            <span className="icon" aria-hidden>{item.icon}</span>
            <span aria-label={item.label}>{item.label}</span>
          </NavLink>
        ))}
        {user?.isAdmin && (
          <NavLink to="/invite-signup" onClick={onClose}>
            <span className="icon" aria-hidden>✉️</span>
            Invite & Signup
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="kicker">Member</div>
        <div className="badge">{user?.name || 'Guest'} {user?.isAdmin ? '(Admin)' : ''}</div>
      </div>
    </aside>
  );
}

// PUBLIC_INTERFACE
function Topbar({ onToggleSidebar, theme, onToggleTheme }) {
  /** Topbar with mobile sidebar toggle and theme switch */
  return (
    <div className="topbar">
      <div className="topbar-title">
        <button className="outline-btn" onClick={onToggleSidebar} aria-label="Toggle navigation">☰</button>
        <div>
          <div className="kicker">Burning Man Logistics</div>
          <div style={{ fontWeight: 800 }}>HME Camp</div>
        </div>
      </div>
      <div>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function AppShell() {
  /** Main application shell with routing and layout */
  const [theme, setTheme] = useState('light');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const toggleSidebarOpen = () => setSidebarOpen((o) => !o);

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="content">
        <Topbar
          onToggleSidebar={toggleSidebarOpen}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <div className="page">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/people" element={<People />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/accommodations" element={<Accommodations />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/dues" element={<Dues />} />
            <Route path="/food" element={<Food />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/invite-signup" element={<InviteSignup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root component: wraps app in providers and router */
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

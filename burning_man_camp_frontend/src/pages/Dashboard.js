import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Dashboard
 * Overview of key stats and quick actions
 */
export default function Dashboard() {
  return (
    <div className="grid cols-3">
      <div className="card">
        <div className="kicker">Members</div>
        <h3 style={{ marginTop: 6, marginBottom: 10 }}>85 Camp Members</h3>
        <div className="badge">12 new</div>
        <div style={{ marginTop: 12 }}>
          <Link className="primary-btn" to="/people">Manage People</Link>
        </div>
      </div>

      <div className="card">
        <div className="kicker">Dues</div>
        <h3 style={{ marginTop: 6, marginBottom: 10 }}>$12,750 Collected</h3>
        <div className="badge">9 pending</div>
        <div style={{ marginTop: 12 }}>
          <Link className="primary-btn" to="/dues">Review Dues</Link>
        </div>
      </div>

      <div className="card">
        <div className="kicker">This Week</div>
        <h3 style={{ marginTop: 6, marginBottom: 10 }}>4 Events</h3>
        <div className="badge">2 meals</div>
        <div style={{ marginTop: 12 }}>
          <Link className="primary-btn" to="/calendar">Open Calendar</Link>
        </div>
      </div>
    </div>
  );
}

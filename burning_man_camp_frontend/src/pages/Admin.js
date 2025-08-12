import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestInvite } from '../services/auth';

/**
 * PUBLIC_INTERFACE
 * Admin
 * Admin-only panel to invite members and perform actions
 */
export default function Admin() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  if (!user?.isAdmin) {
    return <div className="card">Admins only.</div>;
  }

  const sendInvite = async () => {
    setStatus('Sending...');
    await requestInvite(email).catch(() => {});
    setEmail('');
    setStatus('Invite sent (placeholder).');
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="kicker">Invitations</div>
        <h3>Invite a new member</h3>
        <div className="grid cols-2">
          <input className="input" placeholder="member@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="primary-btn" onClick={sendInvite}>Send Invite</button>
        </div>
        <div style={{ marginTop: 8, color: 'var(--text-muted)' }}>{status}</div>
      </div>

      <div className="card">
        <div className="kicker">Maintenance</div>
        <h3>Data sync</h3>
        <button className="outline-btn" onClick={() => alert('Requested backend refresh (placeholder)')}>Refresh from backend</button>
      </div>
    </div>
  );
}

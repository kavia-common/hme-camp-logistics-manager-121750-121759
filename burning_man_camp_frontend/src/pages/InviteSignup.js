import React, { useState } from 'react';
import { acceptInvite, requestInvite } from '../services/auth';

/**
 * PUBLIC_INTERFACE
 * InviteSignup
 * Admin: send invite; Member: accept invite with token
 */
export default function InviteSignup() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState('');
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [acceptStatus, setAcceptStatus] = useState('');

  const sendInvite = async () => {
    setInviteStatus('Sending...');
    await requestInvite(inviteEmail).catch(() => {});
    setInviteStatus('Invite sent (placeholder).');
    setInviteEmail('');
  };

  const accept = async () => {
    setAcceptStatus('Submitting...');
    await acceptInvite(token, profile).catch(() => {});
    setAcceptStatus('Signup successful (placeholder).');
    setToken('');
    setProfile({ name: '', email: '' });
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="kicker">Invite</div>
        <h3>Send Invitation (Admin)</h3>
        <div className="grid cols-3" style={{ alignItems: 'end' }}>
          <input className="input" placeholder="member@example.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          <button className="primary-btn" onClick={sendInvite}>Send Invite</button>
          <div style={{ color: 'var(--text-muted)' }}>{inviteStatus}</div>
        </div>
      </div>

      <div className="card">
        <div className="kicker">Signup</div>
        <h3>Accept Invite</h3>
        <div className="grid cols-2">
          <div>
            <label>Invite Token</label>
            <input className="input" placeholder="Paste invite token" value={token} onChange={(e) => setToken(e.target.value)} />
          </div>
          <div className="grid cols-2">
            <div>
              <label>Name</label>
              <input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div>
              <label>Email</label>
              <input className="input" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </div>
          </div>
          <div>
            <button className="primary-btn" onClick={accept}>Complete Signup</button>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>{acceptStatus}</div>
        </div>
      </div>
    </div>
  );
}

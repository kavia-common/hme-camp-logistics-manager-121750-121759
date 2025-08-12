import React, { useEffect, useState } from 'react';
import { createMember, deleteMember, fetchMembers } from '../services/members';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * People
 * Member directory with simple admin create/delete
 */
export default function People() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [newMember, setNewMember] = useState({ name: '', email: '' });

  const load = async () => {
    setLoading(true);
    const data = await fetchMembers(q);
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const onCreate = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;
    await createMember(newMember).catch(() => {});
    setNewMember({ name: '', email: '' });
    load();
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete member?')) return;
    await deleteMember(id).catch(() => {});
    load();
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="grid cols-2">
          <div>
            <div className="kicker">Directory</div>
            <h3>Camp Members</h3>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
            <input className="input" placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="outline-btn" onClick={load}>Search</button>
          </div>
        </div>

        {loading ? <div>Loading...</div> : (
          <div style={{ overflowX: 'auto', marginTop: 10 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  {user?.isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {members.length === 0 && (
                  <tr><td colSpan={user?.isAdmin ? 4 : 3}>No members found.</td></tr>
                )}
                {members.map((m) => (
                  <tr key={m.id || m.email}>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{m.isAdmin ? 'Admin' : 'Member'}</td>
                    {user?.isAdmin && (
                      <td>
                        <button className="outline-btn" onClick={() => onDelete(m.id)}>Delete</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {user?.isAdmin && (
        <div className="card">
          <div className="kicker">Admin</div>
          <h3>Add Member</h3>
          <form onSubmit={onCreate} className="grid cols-3" style={{ alignItems: 'end' }}>
            <div>
              <label>Name</label>
              <input className="input" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
            </div>
            <div>
              <label>Email</label>
              <input className="input" type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} />
            </div>
            <div>
              <button className="primary-btn" type="submit">Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { createAccommodation, deleteAccommodation, fetchAccommodations, updateAccommodation } from '../services/accommodations';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Accommodations
 * Admin can plan layout; members can view
 */
export default function Accommodations() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'tent', capacity: 2 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await fetchAccommodations();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const onCreate = async (e) => {
    e.preventDefault();
    await createAccommodation(form).catch(() => {});
    setForm({ name: '', type: 'tent', capacity: 2 });
    load();
  };

  const onUpdate = async (id, payload) => {
    await updateAccommodation(id, payload).catch(() => {});
    load();
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete item?')) return;
    await deleteAccommodation(id).catch(() => {});
    load();
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="kicker">Layout</div>
        <h3>Accommodations</h3>
        {loading ? <div>Loading...</div> : (
          <div style={{ overflowX: 'auto', marginTop: 10 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  {user?.isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr><td colSpan={user?.isAdmin ? 4 : 3}>No accommodations.</td></tr>
                )}
                {items.map((a) => (
                  <tr key={a.id || a.name}>
                    <td>{a.name}</td>
                    <td>{a.type}</td>
                    <td>{a.capacity}</td>
                    {user?.isAdmin && (
                      <td style={{ display: 'flex', gap: 6 }}>
                        <button className="outline-btn" onClick={() => onUpdate(a.id, { capacity: (a.capacity || 0) + 1 })}>+ Capacity</button>
                        <button className="outline-btn" onClick={() => onDelete(a.id)}>Delete</button>
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
          <h3>Add accommodation</h3>
          <form className="grid cols-3" onSubmit={onCreate} style={{ alignItems: 'end' }}>
            <div>
              <label>Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label>Type</label>
              <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="tent">Tent</option>
                <option value="shiftpod">ShiftPod</option>
                <option value="rv">RV</option>
              </select>
            </div>
            <div>
              <label>Capacity</label>
              <input className="input" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
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

import React, { useEffect, useState } from 'react';
import { createEvent, deleteEvent, fetchEvents } from '../services/calendar';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Calendar
 * Shared events calendar with basic list view
 */
export default function Calendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ date: '', title: '', category: 'event' });

  const load = async () => {
    const data = await fetchEvents();
    setEvents(data);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const onCreate = async (e) => {
    e.preventDefault();
    await createEvent(form).catch(() => {});
    setForm({ date: '', title: '', category: 'event' });
    load();
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete event?')) return;
    await deleteEvent(id).catch(() => {});
    load();
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="kicker">Events</div>
        <h3>Camp Calendar</h3>
        <div style={{ overflowX: 'auto', marginTop: 10 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && <tr><td colSpan={4}>No events yet.</td></tr>}
              {events.map((ev) => (
                <tr key={ev.id || ev.title}>
                  <td>{ev.date}</td>
                  <td>{ev.title}</td>
                  <td><span className="badge">{ev.category}</span></td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    {user?.isAdmin && <button className="outline-btn" onClick={() => onDelete(ev.id)}>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {user?.isAdmin && (
        <div className="card">
          <div className="kicker">Admin</div>
          <h3>Create Event</h3>
          <form className="grid cols-3" onSubmit={onCreate} style={{ alignItems: 'end' }}>
            <div>
              <label>Date</label>
              <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label>Title</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label>Category</label>
              <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="event">Event</option>
                <option value="shift">Shift</option>
                <option value="meal">Meal</option>
              </select>
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

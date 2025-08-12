import React, { useEffect, useState } from 'react';
import { createMeal, deleteMeal, fetchMeals, signupForMeal } from '../services/food';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Food
 * Shared meals planning and signups
 */
export default function Food() {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [form, setForm] = useState({ date: '', title: '', type: 'dinner' });

  const load = async () => {
    const data = await fetchMeals();
    setMeals(data);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const onCreate = async (e) => {
    e.preventDefault();
    await createMeal(form).catch(() => {});
    setForm({ date: '', title: '', type: 'dinner' });
    load();
  };

  const onSignup = async (mealId) => {
    await signupForMeal(mealId, user?.id).catch(() => {});
    load();
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete meal?')) return;
    await deleteMeal(id).catch(() => {});
    load();
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="kicker">Meals</div>
        <h3>Shared Meal Planning</h3>
        <div style={{ overflowX: 'auto', marginTop: 10 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Meal</th>
                <th>Type</th>
                <th>Signups</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {meals.length === 0 && <tr><td colSpan={5}>No meals yet.</td></tr>}
              {meals.map((m) => (
                <tr key={m.id || m.title}>
                  <td>{m.date}</td>
                  <td>{m.title}</td>
                  <td>{m.type}</td>
                  <td>{Array.isArray(m.signups) ? m.signups.length : 0}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="outline-btn" onClick={() => onSignup(m.id)}>Sign up</button>
                    {user?.isAdmin && <button className="outline-btn" onClick={() => onDelete(m.id)}>Delete</button>}
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
        <h3>Create Meal</h3>
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
            <label>Type</label>
            <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
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

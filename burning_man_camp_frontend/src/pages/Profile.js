import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Profile
 * User profile: accommodation, crew, and dates
 */
export default function Profile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    accommodation: '',
    crew: '',
    experience: '',
    arrival: '',
    departure: '',
  });

  const onSave = (e) => {
    e.preventDefault();
    setUser({ ...user, ...profile });
    alert('Profile saved (placeholder)');
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="kicker">My Profile</div>
        <h3>Personal Details</h3>
        <form onSubmit={onSave} className="grid cols-2">
          <div>
            <label>Name</label>
            <input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div>
            <label>Email</label>
            <input className="input" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          </div>
          <div>
            <label>Accommodation</label>
            <input className="input" placeholder="Tent/RV, etc." value={profile.accommodation} onChange={(e) => setProfile({ ...profile, accommodation: e.target.value })} />
          </div>
          <div>
            <label>Crew</label>
            <select className="select" value={profile.crew} onChange={(e) => setProfile({ ...profile, crew: e.target.value })}>
              <option value="">Select crew</option>
              <option value="setup">Setup</option>
              <option value="strike">Strike</option>
              <option value="kitchen">Kitchen</option>
              <option value="operations">Operations</option>
            </select>
          </div>
          <div className="grid cols-2">
            <div>
              <label>Arrival</label>
              <input className="input" type="date" value={profile.arrival} onChange={(e) => setProfile({ ...profile, arrival: e.target.value })} />
            </div>
            <div>
              <label>Departure</label>
              <input className="input" type="date" value={profile.departure} onChange={(e) => setProfile({ ...profile, departure: e.target.value })} />
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Experience & Notes</label>
            <textarea className="textarea" rows={4} value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: e.target.value })} />
          </div>
          <div>
            <button className="primary-btn" type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

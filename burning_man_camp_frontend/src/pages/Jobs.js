import React, { useEffect, useState } from 'react';
import { assignJob, createJob, deleteJob, fetchJobs } from '../services/jobs';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Jobs
 * Camp job management and assignments
 */
export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: '', crew: 'setup', slots: 1 });

  const load = async () => {
    const data = await fetchJobs();
    setJobs(data);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const onCreate = async (e) => {
    e.preventDefault();
    await createJob(form).catch(() => {});
    setForm({ title: '', crew: 'setup', slots: 1 });
    load();
  };

  const onAssign = async (jobId) => {
    await assignJob(jobId, user?.id).catch(() => {});
    load();
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete job?')) return;
    await deleteJob(id).catch(() => {});
    load();
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="kicker">Jobs</div>
        <h3>Camp Jobs & Assignments</h3>
        <div style={{ overflowX: 'auto', marginTop: 10 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Crew</th>
                <th>Slots</th>
                <th>Assigned</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 && (
                <tr><td colSpan={5}>No jobs yet.</td></tr>
              )}
              {jobs.map((j) => (
                <tr key={j.id || j.title}>
                  <td>{j.title}</td>
                  <td>{j.crew}</td>
                  <td>{j.slots}</td>
                  <td>{Array.isArray(j.assignees) ? j.assignees.length : 0}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="outline-btn" onClick={() => onAssign(j.id)}>Volunteer</button>
                    {user?.isAdmin && <button className="outline-btn" onClick={() => onDelete(j.id)}>Delete</button>}
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
          <h3>Create Job</h3>
          <form className="grid cols-3" onSubmit={onCreate} style={{ alignItems: 'end' }}>
            <div>
              <label>Title</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label>Crew</label>
              <select className="select" value={form.crew} onChange={(e) => setForm({ ...form, crew: e.target.value })}>
                <option value="setup">Setup</option>
                <option value="strike">Strike</option>
                <option value="kitchen">Kitchen</option>
                <option value="operations">Operations</option>
              </select>
            </div>
            <div>
              <label>Slots</label>
              <input className="input" type="number" value={form.slots} onChange={(e) => setForm({ ...form, slots: Number(e.target.value) })} />
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

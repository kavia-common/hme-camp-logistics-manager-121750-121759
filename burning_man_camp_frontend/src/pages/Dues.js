import React, { useEffect, useMemo, useState } from 'react';
import { approveDue, fetchDues, markPaid } from '../services/dues';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Dues
 * Dues tracking and payment (Venmo link)
 */
export default function Dues() {
  const { user } = useAuth();
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);

  const venmoHandle = process.env.REACT_APP_VENMO_HANDLE || '';
  const [amount, setAmount] = useState(100);
  const [note, setNote] = useState('HME Camp Dues');

  const venmoUrl = useMemo(() => {
    if (!venmoHandle) return null;
    const n = encodeURIComponent(note);
    return `https://venmo.com/u/${encodeURIComponent(venmoHandle)}?txn=pay&note=${n}&amount=${encodeURIComponent(amount)}`;
  }, [venmoHandle, note, amount]);

  const load = async () => {
    setLoading(true);
    const data = await fetchDues();
    setDues(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const pay = async (id) => {
    await markPaid(id, 'venmo:placeholder').catch(() => {});
    load();
  };
  const approve = async (id) => {
    await approveDue(id).catch(() => {});
    load();
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="kicker">Payments</div>
        <h3>Dues & Payments</h3>

        <div className="grid cols-3" style={{ alignItems: 'end' }}>
          <div>
            <label>Amount</label>
            <input className="input" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>
          <div>
            <label>Note</label>
            <input className="input" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div>
            {venmoUrl ? (
              <a className="primary-btn" href={venmoUrl} target="_blank" rel="noreferrer">Pay via Venmo</a>
            ) : (
              <button className="primary-btn" onClick={() => alert('Set REACT_APP_VENMO_HANDLE')} type="button">
                Configure Venmo Handle
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="kicker">My Dues</div>
        {loading ? <div>Loading...</div> : (
          <div style={{ overflowX: 'auto', marginTop: 10 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dues.length === 0 && <tr><td colSpan={4}>No dues yet.</td></tr>}
                {dues.map((d) => (
                  <tr key={d.id || d.description}>
                    <td>{d.description}</td>
                    <td>${d.amount}</td>
                    <td>{d.status || 'pending'}</td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      {d.status !== 'paid' && <button className="outline-btn" onClick={() => pay(d.id)}>Mark Paid</button>}
                      {user?.isAdmin && d.status !== 'approved' && <button className="outline-btn" onClick={() => approve(d.id)}>Approve</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

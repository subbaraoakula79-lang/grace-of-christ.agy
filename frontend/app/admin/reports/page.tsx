'use client';
import { useEffect, useState } from 'react';

interface ReportStats { totalDonations: number; totalRevenue: number; totalEvents: number; totalSermons: number; }

export default function AdminReportsPage() {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [stats, setStats] = useState<ReportStats | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('goc_access_token');
    fetch(`${API}/reports/summary`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setStats).catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadCSV = () => {
    const token = localStorage.getItem('goc_access_token');
    const params = new URLSearchParams({ ...(from && { from }), ...(to && { to }) });
    const url = `${API}/reports/donations/csv?${params}`;
    // Trigger download with auth (fetch + blob)
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `GOC_Donations_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      });
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reports</h1>
      <p style={{ color: 'var(--cream-dim)', fontSize: '0.88rem', marginBottom: '2.5rem' }}>Export donation data and review ministry statistics.</p>

      {/* Summary */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Total Donations', value: stats.totalDonations, icon: '💰', color: 'var(--gold)' },
            { label: 'Total Revenue', value: `₹${Number(stats.totalRevenue).toLocaleString('en-IN')}`, icon: '💵', color: '#4ade80' },
            { label: 'Events', value: stats.totalEvents, icon: '📅', color: '#60a5fa' },
            { label: 'Sermons', value: stats.totalSermons, icon: '🎙', color: '#c084fc' },
          ].map(s => (
            <div key={s.label} className="glass" style={{ padding: '1.5rem', borderRadius: '14px', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--cream-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* CSV Export */}
      <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Export Donation Report (CSV)</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>From Date</label>
            <input id="report-from" type="date" className="input-field" value={from} onChange={e => setFrom(e.target.value)} style={{ width: '180px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>To Date</label>
            <input id="report-to" type="date" className="input-field" value={to} onChange={e => setTo(e.target.value)} style={{ width: '180px' }} />
          </div>
          <button id="export-csv-btn" className="btn btn-gold" onClick={downloadCSV}>⬇ Download CSV</button>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', marginTop: '1rem', opacity: 0.7 }}>
          Leave dates empty to export all donations. CSV includes: Receipt ID, Donor, Email, Phone, Amount, Method, Date.
        </p>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';

interface Stats {
  totalDonations: number;
  totalRevenue: number;
  totalEvents: number;
  totalSermons: number;
  unreadMessages: number;
  totalGalleryImages: number;
}

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="glass card-hover" style={{ padding: '1.75rem', borderRadius: '16px', borderLeft: `4px solid ${color || 'var(--gold)'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--cream-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: color || 'var(--gold)', lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', marginTop: '0.4rem' }}>{sub}</div>}
        </div>
        <div style={{ fontSize: '2rem', opacity: 0.6 }}>{icon}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('goc_access_token');
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    fetch(`${API}/reports/summary`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>Welcome back, Pastor. Here&apos;s an overview of Grace of Christ.</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--cream-dim)' }}>Loading...</div>
      ) : stats ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <StatCard icon="💰" label="Total Donations" value={stats.totalDonations} sub="Successful donations" color="var(--gold)" />
          <StatCard icon="💵" label="Total Revenue" value={`₹${Number(stats.totalRevenue).toLocaleString('en-IN')}`} sub="All time" color="#4ade80" />
          <StatCard icon="📅" label="Events" value={stats.totalEvents} sub="Published events" color="#60a5fa" />
          <StatCard icon="🎙" label="Sermons" value={stats.totalSermons} sub="In archive" color="#c084fc" />
          <StatCard icon="✉️" label="Unread Messages" value={stats.unreadMessages} sub="Awaiting response" color={stats.unreadMessages > 0 ? '#f87171' : 'var(--cream-dim)'} />
          <StatCard icon="🖼" label="Gallery Images" value={stats.totalGalleryImages} sub="Uploaded" color="#fb923c" />
        </div>
      ) : (
        <div style={{ padding: '1rem', color: '#f87171', fontSize: '0.9rem' }}>Could not load stats. Is the backend running?</div>
      )}

      {/* Quick Links */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--cream)' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { href: '/admin/donations', label: 'View Donations', icon: '💰' },
            { href: '/admin/events', label: 'Add Event', icon: '📅' },
            { href: '/admin/sermons', label: 'Add Sermon', icon: '🎙' },
            { href: '/admin/gallery', label: 'Upload Image', icon: '🖼' },
            { href: '/admin/messages', label: 'Read Messages', icon: '✉️' },
            { href: '/admin/reports', label: 'Export Report', icon: '📈' },
          ].map(a => (
            <a key={a.href} href={a.href} className="glass card-hover" style={{ padding: '1.25rem', borderRadius: '14px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '1.75rem' }}>{a.icon}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--cream)', fontWeight: 500 }}>{a.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

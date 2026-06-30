'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Donation {
  id: string;
  receiptId: string;
  donorName: string;
  email: string;
  phone: string;
  amount: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  notes?: string;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [total, setTotal] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [search, setSearch] = useState('');
  const [customQR, setCustomQR] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load custom QR code if set
    const savedQR = localStorage.getItem('goc_donation_qr');
    if (savedQR) {
      setCustomQR(savedQR);
    }
  }, []);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const token = () => localStorage.getItem('goc_access_token');

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '100',
        ...(search && { search })
      });
      const res = await fetch(`${API}/donations?${params}`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDonations(data.donations);
        setTotal(data.pagination.total);
        setTotalRevenue(data.stats.totalAmount);
        if (!search) {
          localStorage.setItem('goc_donations', JSON.stringify(data.donations));
        }
      } else {
        // Fallback
        const stored = localStorage.getItem('goc_donations');
        if (stored) {
          const localData = JSON.parse(stored);
          setDonations(localData);
          setTotal(localData.length);
          setTotalRevenue(localData.reduce((sum: number, d: any) => sum + parseFloat(d.amount || '0'), 0));
        }
      }
    } catch (err) {
      console.error('Failed to fetch donations from API', err);
      const stored = localStorage.getItem('goc_donations');
      if (stored) {
        try {
          const localData = JSON.parse(stored);
          setDonations(localData);
          setTotal(localData.length);
          setTotalRevenue(localData.reduce((sum: number, d: any) => sum + parseFloat(d.amount || '0'), 0));
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  }, [search, API]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        localStorage.setItem('goc_donation_qr', base64);
        setCustomQR(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetQR = () => {
    localStorage.removeItem('goc_donation_qr');
    setCustomQR(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Donations & Setup</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{total} total scan intents · ₹{totalRevenue.toLocaleString('en-IN')} pledged</p>
        </div>
      </div>

      {/* Donation Setup Section */}
      <div className="spatial-glass-mid" style={{ padding: '2rem', border: '1px solid rgba(16, 185, 129, 0.15)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>UPI QR Code Setup</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Set the UPI QR Code image that will be shown to public website visitors when they trigger the donate pop-up.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Current QR Preview */}
          <div style={{
            background: '#fff', padding: '0.75rem', borderRadius: '12px',
            width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}>
            <img 
              src={customQR || '/qr.jpeg.jpeg'} 
              alt="Current QR Code" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label className="btn-spatial btn-primary" style={{ cursor: 'pointer', padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>
              Upload New QR Code
              <input type="file" accept="image/*" onChange={handleQRUpload} style={{ display: 'none' }} />
            </label>
            {customQR && (
              <button onClick={handleResetQR} className="btn-spatial btn-glass" style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>
                Reset to Default
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input id="donations-search" className="input-spatial" type="text" placeholder="🔍 Search by name, email, or receipt ID..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '480px', borderRadius: 'var(--r-pill)', background: 'rgba(255, 255, 255, 0.05)' }} />
      </div>

      {/* Table */}
      <div className="spatial-glass" style={{ border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(16,185,129,0.15)' }}>
                {['ID / Receipt', 'Donor', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--violet)', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>Loading transactions...</td></tr>
              ) : donations.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>No transactions logged.</td></tr>
              ) : (
                donations.map((d, idx) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--violet)', fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>{d.receiptId}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.donorName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{d.email}</div>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--teal)', fontWeight: 700 }}>₹{Number(d.amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.78rem' }}>{d.paymentMethod}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: '#34D399', border: '1px solid rgba(16,185,129,0.25)' }}>{d.status}</span>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{new Date(d.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

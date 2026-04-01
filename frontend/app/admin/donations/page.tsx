'use client';
import { useEffect, useState, useCallback } from 'react';

interface Donation {
  id: string; receiptId: string; donorName: string; email: string;
  phone: string; amount: string; paymentMethod: string; status: string; createdAt: string;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [total, setTotal] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('goc_access_token');
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const params = new URLSearchParams({ page: String(page), limit: '15', ...(search && { search }) });
    const res = await fetch(`${API}/donations?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setDonations(data.donations || []);
    setTotal(data.pagination?.total || 0);
    setPages(data.pagination?.pages || 1);
    setTotalRevenue(data.stats?.totalAmount || 0);
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);

  const downloadPDF = (receiptId: string) => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    window.open(`${API}/donations/receipt/${receiptId}/pdf`, '_blank');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Donations</h1>
          <p style={{ color: 'var(--cream-dim)', fontSize: '0.88rem' }}>{total} total · ₹{Number(totalRevenue).toLocaleString('en-IN')} collected</p>
        </div>
        <a
          id="export-donations-csv"
          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/reports/donations/csv`}
          target="_blank" rel="noopener noreferrer"
          className="btn btn-outline-gold" style={{ padding: '0.6rem 1.4rem', fontSize: '0.82rem' }}>
          ⬇ Export CSV
        </a>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input id="donations-search" className="input-field" type="text" placeholder="🔍 Search by name, email, or receipt ID..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ maxWidth: '480px' }} />
      </div>

      {/* Table */}
      <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                {['Receipt ID', 'Donor', 'Amount', 'Method', 'Status', 'Date', 'PDF'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--cream-dim)' }}>Loading...</td></tr>
              ) : donations.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--cream-dim)' }}>No donations found.</td></tr>
              ) : (
                donations.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--gold)', fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>{d.receiptId}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <div style={{ fontWeight: 500, color: 'var(--cream)' }}>{d.donorName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--cream-dim)' }}>{d.email}</div>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', color: '#4ade80', fontWeight: 700 }}>₹{Number(d.amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--cream-dim)', textTransform: 'uppercase', fontSize: '0.78rem' }}>{d.paymentMethod}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <span style={{ padding: '0.2rem 0.75rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, background: d.status === 'SUCCESS' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: d.status === 'SUCCESS' ? '#4ade80' : '#f87171', border: `1px solid ${d.status === 'SUCCESS' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>{d.status}</span>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--cream-dim)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{new Date(d.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <button id={`dl-pdf-${d.receiptId}`} onClick={() => downloadPDF(d.receiptId)} className="btn btn-glass" style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}>⬇ PDF</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer', background: p === page ? 'var(--gold)' : 'rgba(255,255,255,0.06)', color: p === page ? '#070B14' : 'var(--cream)', fontWeight: 600, fontSize: '0.85rem' }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}

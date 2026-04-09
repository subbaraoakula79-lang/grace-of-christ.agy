'use client';
import { useEffect, useState, useCallback } from 'react';

interface Message {
  id: string; name: string; email: string; phone?: string;
  subject?: string; message: string; isRead: boolean; createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(false);

  const fetch_messages = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('goc_access_token');
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const params = unread ? '?unread=true' : '';
    const res = await fetch(`${API}/contact${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setMessages(data.messages || []);
    setLoading(false);
  }, [unread]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetch_messages(); }, [fetch_messages]);

  const markRead = async (id: string) => {
    const token = localStorage.getItem('goc_access_token');
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    await fetch(`${API}/contact/${id}/read`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
    setMessages(ms => ms.map(m => m.id === id ? { ...m, isRead: true } : m));
    if (selected?.id === id) setSelected(s => s ? { ...s, isRead: true } : null);
  };

  const deleteMsg = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    const token = localStorage.getItem('goc_access_token');
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    await fetch(`${API}/contact/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setMessages(ms => ms.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>Messages</h1>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--cream-dim)', cursor: 'pointer' }}>
          <input type="checkbox" checked={unread} onChange={e => setUnread(e.target.checked)} style={{ accentColor: 'var(--gold)' }} />
          Show unread only
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.5fr' : '1fr', gap: '1.5rem' }}>
        {/* List */}
        <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden', height: 'fit-content' }}>
          {loading ? <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--cream-dim)' }}>Loading...</div> :
            messages.length === 0 ? <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--cream-dim)' }}>No messages found.</div> :
              messages.map(m => (
                <div key={m.id} onClick={() => { setSelected(m); if (!m.isRead) markRead(m.id); }}
                  style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', background: selected?.id === m.id ? 'rgba(212,175,55,0.07)' : m.isRead ? 'transparent' : 'rgba(107,63,160,0.06)', transition: 'background 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: m.isRead ? 400 : 700, color: 'var(--cream)', fontSize: '0.9rem' }}>{m.name}</span>
                    {!m.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7B5EA7', display: 'inline-block' }} />}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gold)', marginBottom: '0.25rem' }}>{m.subject || '(No subject)'}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(200,196,188,0.4)', marginTop: '0.4rem' }}>{new Date(m.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
              ))
          }
        </div>

        {/* Detail */}
        {selected && (
          <div className="glass" style={{ borderRadius: '16px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>{selected.subject || '(No subject)'}</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--cream-dim)', margin: 0 }}>From: <strong style={{ color: 'var(--cream)' }}>{selected.name}</strong> · {selected.email}{selected.phone ? ` · ${selected.phone}` : ''}</p>
              </div>
              <button id={`delete-msg-${selected.id}`} onClick={() => deleteMsg(selected.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1.2rem' }}>🗑</button>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', color: 'var(--cream-dim)', lineHeight: 1.8, fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{selected.message}</div>
            <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message to Grace of Christ'}`}
              className="btn btn-gold" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>✉ Reply by Email</a>
          </div>
        )}
      </div>
    </div>
  );
}

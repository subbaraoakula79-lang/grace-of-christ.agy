'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Message {
  id: string; name: string; email: string; phone?: string;
  subject?: string; message: string; read: boolean; createdAt: string;
}

const defaultMessages: Message[] = [
  {
    id: 'msg-1',
    name: 'Ravi Kumar',
    email: 'ravi.k@gmail.com',
    phone: '+91 94405 12345',
    subject: 'Prayer Request for Family health',
    message: 'Dear Pastor John Prasad,\n\nRequesting prayers for my mother who is undergoing surgery next Monday. Please remember her in your prayers. Thank you.',
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  },
  {
    id: 'msg-2',
    name: 'Sarah D.',
    email: 'sarah.d@outlook.com',
    phone: '+91 81234 56789',
    subject: 'Worship Ministry Inquiry',
    message: 'Hello GOC team,\n\nI recently moved to Yetimoga, Kakinada and would love to join the choir/worship team. Can you please let me know when and where the practices are held? God bless!',
    read: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
  }
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const token = () => localStorage.getItem('goc_access_token');

  const fetchMessages = useCallback(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('goc_messages');
      let data: Message[] = stored ? JSON.parse(stored) : [];
      if (data.length === 0 && !stored) {
        localStorage.setItem('goc_messages', JSON.stringify(defaultMessages));
        data = defaultMessages;
      }

      if (unread) {
        data = data.filter(m => !m.read);
      }

      // Sync field naming differences (read vs isRead) from backend if needed
      setMessages(data);
    } catch (err) {
      console.error('Failed to parse local messages', err);
    } finally {
      setLoading(false);
    }
  }, [unread]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markRead = async (id: string) => {
    try {
      const stored = localStorage.getItem('goc_messages');
      if (stored) {
        const data: Message[] = JSON.parse(stored);
        const updated = data.map(m => m.id === id ? { ...m, read: true } : m);
        localStorage.setItem('goc_messages', JSON.stringify(updated));
      }
      setMessages(ms => ms.map(m => m.id === id ? { ...m, read: true } : m));
      if (selected?.id === id) setSelected(s => s ? { ...s, read: true } : null);

      await fetch(`${API}/contact/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token()}` }
      });
    } catch (err) {
      console.warn('API error during markRead, updated locally', err);
    }
  };

  const deleteMsg = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      const stored = localStorage.getItem('goc_messages');
      if (stored) {
        const data: Message[] = JSON.parse(stored);
        const filtered = data.filter(m => m.id !== id);
        localStorage.setItem('goc_messages', JSON.stringify(filtered));
      }
      setMessages(ms => ms.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);

      await fetch(`${API}/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` }
      });
    } catch (err) {
      console.warn('API error during deleteMsg, updated locally', err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Messages</h1>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500 }}>
          <input type="checkbox" checked={unread} onChange={e => setUnread(e.target.checked)} style={{ accentColor: 'var(--violet)' }} />
          Show unread only
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.5fr' : '1fr', gap: '1.5rem' }}>
        {/* List */}
        <div className="spatial-glass" style={{ border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', height: 'fit-content' }}>
          {loading ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading messages...</div>
          ) : messages.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No messages found.</div>
          ) : (
            messages.map(m => (
              <div key={m.id} onClick={() => { setSelected(m); if (!m.read) markRead(m.id); }}
                style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  background: selected?.id === m.id ? 'rgba(16, 185, 129, 0.08)' : m.read ? 'transparent' : 'rgba(192, 132, 252, 0.05)',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: m.read ? 600 : 800, color: 'var(--text-primary)', fontSize: '0.92rem' }}>{m.name}</span>
                  {!m.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block', boxShadow: '0 0 8px var(--amber)' }} />}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--violet)', marginBottom: '0.35rem', fontWeight: 600 }}>{m.subject || '(No subject)'}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '0.5rem', fontWeight: 500 }}>{new Date(m.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
            ))
          )}
        </div>

        {/* Detail */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="spatial-glass-mid"
            style={{ padding: '2rem', border: '1px solid rgba(16, 185, 129, 0.15)', height: 'fit-content' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{selected.subject || '(No subject)'}</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  From: <strong style={{ color: 'var(--text-primary)' }}>{selected.name}</strong> · {selected.email}{selected.phone ? ` · ${selected.phone}` : ''}
                </p>
              </div>
              <button id={`delete-msg-${selected.id}`} onClick={() => deleteMsg(selected.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1.3rem', padding: '0.2rem' }}>🗑</button>
            </div>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '0.92rem', whiteSpace: 'pre-wrap' }}>
              {selected.message}
            </div>
            
            <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message to Grace of Christ'}`}
              className="btn-spatial btn-primary" style={{ marginTop: '2rem', textDecoration: 'none' }}>
              ✉ Reply by Email
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}

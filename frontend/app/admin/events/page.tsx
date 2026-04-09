'use client';
import { useEffect, useState, useCallback } from 'react';

interface Event {
  id: string; title: string; description: string; date: string;
  time: string; location: string; isPublished: boolean;
}

const EMPTY: Omit<Event, 'id'> = { title: '', description: '', date: '', time: '', location: 'Grace of Christ Church', isPublished: true };

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState<Omit<Event, 'id'>>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const token = () => localStorage.getItem('goc_access_token');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${API}/events?limit=50`, { headers: { Authorization: `Bearer ${token()}` } });
    const data = await res.json();
    setEvents(data.events || []);
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError(''); };
  const openEdit = (ev: Event) => { setForm({ title: ev.title, description: ev.description, date: ev.date.split('T')[0], time: ev.time, location: ev.location, isPublished: ev.isPublished }); setEditId(ev.id); setShowForm(true); setError(''); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const body = { ...form, date: new Date(form.date).toISOString() };
      const url = editId ? `${API}/events/${editId}` : `${API}/events`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Save failed');
      setShowForm(false); fetchEvents();
    } catch { setError('Failed to save event.'); }
    setSaving(false);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`${API}/events/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    fetchEvents();
  };

  const F = (k: keyof typeof form, v: Event[keyof Event]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>Events</h1>
        <button id="create-event-btn" className="btn btn-gold" onClick={openCreate}>+ Add Event</button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>{editId ? 'Edit Event' : 'Create Event'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div><label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>Title *</label><input id="event-title" className="input-field" value={form.title} onChange={e => F('title', e.target.value)} /></div>
            <div><label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>Date *</label><input id="event-date" type="date" className="input-field" value={form.date} onChange={e => F('date', e.target.value)} /></div>
            <div><label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>Time *</label><input id="event-time" className="input-field" placeholder="6:00 AM – 9:30 AM" value={form.time} onChange={e => F('time', e.target.value)} /></div>
            <div><label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>Location</label><input id="event-location" className="input-field" value={form.location} onChange={e => F('location', e.target.value)} /></div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>Description *</label>
            <textarea id="event-description" className="input-field" rows={3} value={form.description} onChange={e => F('description', e.target.value)} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input id="event-published" type="checkbox" checked={form.isPublished} onChange={e => F('isPublished', e.target.checked)} style={{ accentColor: 'var(--gold)' }} />
            <label htmlFor="event-published" style={{ fontSize: '0.85rem', color: 'var(--cream-dim)' }}>Published</label>
          </div>
          {error && <p style={{ color: '#f87171', fontSize: '0.82rem', marginTop: '0.75rem' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button id="save-event-btn" className="btn btn-gold" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Event'}</button>
            <button className="btn btn-glass" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
              {['Title', 'Date', 'Time', 'Published', 'Actions'].map(h => (
                <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--cream-dim)' }}>Loading...</td></tr>
              : events.map(ev => (
                <tr key={ev.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.9rem 1.25rem', color: 'var(--cream)', fontWeight: 500 }}>{ev.title}</td>
                  <td style={{ padding: '0.9rem 1.25rem', color: 'var(--cream-dim)', fontSize: '0.82rem' }}>{new Date(ev.date).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '0.9rem 1.25rem', color: 'var(--cream-dim)', fontSize: '0.82rem' }}>{ev.time}</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}><span style={{ padding: '0.2rem 0.65rem', borderRadius: 9999, fontSize: '0.72rem', background: ev.isPublished ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', color: ev.isPublished ? '#4ade80' : 'var(--cream-dim)', border: `1px solid ${ev.isPublished ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}` }}>{ev.isPublished ? 'Live' : 'Draft'}</span></td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button id={`edit-event-${ev.id}`} className="btn btn-glass" onClick={() => openEdit(ev)} style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}>✏ Edit</button>
                      <button id={`delete-event-${ev.id}`} onClick={() => deleteEvent(ev.id)} style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '6px', cursor: 'pointer' }}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

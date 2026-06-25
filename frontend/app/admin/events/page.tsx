'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Event {
  id: string; title: string; description: string; date: string;
  time: string; location: string; isPublished: boolean;
}

const EMPTY: Omit<Event, 'id'> = { title: '', description: '', date: '', time: '', location: 'Grace of Christ Church', isPublished: true };

const defaultEvents: Event[] = [
  {
    id: 'ev-1',
    title: 'Sunday Worship & Revival Service',
    description: 'Join us for an uplifting time of praise, worship, and a powerful message of hope from Pastor K. John Prasad.',
    date: '2026-07-05',
    time: '6:00 AM & 9:30 AM',
    location: 'Yetimoga, Kakinada',
    isPublished: true,
  },
  {
    id: 'ev-2',
    title: 'Midweek Intercessory Prayer Meeting',
    description: 'A special time dedicated to corporate intercession for our nation, families, and personal prayer requests.',
    date: '2026-07-08',
    time: '6:30 PM',
    location: 'Yetimoga, Kakinada',
    isPublished: true,
  },
  {
    id: 'ev-3',
    title: 'Youth Awakening Conference 2026',
    description: 'An annual gathering of young believers across Andhra Pradesh focused on revival, purpose, and biblical discipleship.',
    date: '2026-08-14',
    time: '9:00 AM – 4:00 PM',
    location: 'Grace of Christ Church Grounds',
    isPublished: true,
  }
];

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
    try {
      const res = await fetch(`${API}/events?all=true&limit=100`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events);
        localStorage.setItem('goc_events', JSON.stringify(data.events));
      } else {
        const stored = localStorage.getItem('goc_events');
        if (stored) setEvents(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to fetch events from API', err);
      const stored = localStorage.getItem('goc_events');
      if (stored) {
        try {
          setEvents(JSON.parse(stored));
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  }, [API]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError(''); };
  const openEdit = (ev: Event) => {
    setForm({
      title: ev.title,
      description: ev.description,
      date: ev.date.split('T')[0],
      time: ev.time,
      location: ev.location,
      isPublished: ev.isPublished
    });
    setEditId(ev.id);
    setShowForm(true);
    setError('');
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.date || !form.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setSaving(true); setError('');
    
    try {
      const eventData = {
        title: form.title,
        description: form.description,
        date: new Date(form.date).toISOString(),
        time: form.time || 'N/A',
        location: form.location || 'Grace of Christ Church',
        isPublished: form.isPublished
      };

      const url = editId ? `${API}/events/${editId}` : `${API}/events`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(eventData)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to save event: ${errText}`);
      }

      setShowForm(false);
      fetchEvents();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'API sync failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      const res = await fetch(`${API}/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` }
      });
      if (res.ok) {
        fetchEvents();
      } else {
        alert('Failed to delete event from database');
      }
    } catch (err) {
      console.error('API deletion failed', err);
      alert('Network error: Failed to delete event.');
    }
  };

  const F = (k: keyof typeof form, v: Event[keyof Event]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Events</h1>
        <button id="create-event-btn" className="btn-spatial btn-primary" onClick={openCreate}>+ Add Event</button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="spatial-glass-mid" 
          style={{ padding: '2.5rem', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.15)' }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{editId ? 'Edit Event' : 'Create Event'}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Title *</label>
              <input id="event-title" className="input-spatial" value={form.title} onChange={e => F('title', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Date *</label>
              <input id="event-date" type="date" className="input-spatial" value={form.date} onChange={e => F('date', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Time *</label>
              <input id="event-time" className="input-spatial" placeholder="6:00 AM – 9:30 AM" value={form.time} onChange={e => F('time', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Location</label>
              <input id="event-location" className="input-spatial" value={form.location} onChange={e => F('location', e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Description *</label>
            <textarea id="event-description" className="input-spatial" rows={3} value={form.description} onChange={e => F('description', e.target.value)} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input id="event-published" type="checkbox" checked={form.isPublished} onChange={e => F('isPublished', e.target.checked)} style={{ accentColor: 'var(--violet)' }} />
            <label htmlFor="event-published" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Published</label>
          </div>
          
          {error && <p style={{ color: '#f87171', fontSize: '0.82rem', marginTop: '1rem', fontWeight: 500 }}>⚠️ {error}</p>}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button id="save-event-btn" className="btn-spatial btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Event'}</button>
            <button className="btn-spatial btn-glass" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <div className="spatial-glass" style={{ border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(16,185,129,0.15)' }}>
              {['Title', 'Date', 'Time', 'Published', 'Actions'].map(h => (
                <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--violet)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading events...</td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No events stored.</td></tr>
            ) : (
              events.map((ev, idx) => (
                <tr key={ev.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                  <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>{ev.title}</td>
                  <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{new Date(ev.date).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{ev.time}</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <span style={{ padding: '0.2rem 0.65rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, background: ev.isPublished ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', color: ev.isPublished ? '#34D399' : 'var(--text-secondary)', border: `1px solid ${ev.isPublished ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}` }}>
                      {ev.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button id={`edit-event-${ev.id}`} className="btn-spatial btn-glass" onClick={() => openEdit(ev)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>✏ Edit</button>
                      <button id={`delete-event-${ev.id}`} onClick={() => deleteEvent(ev.id)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', cursor: 'pointer' }}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

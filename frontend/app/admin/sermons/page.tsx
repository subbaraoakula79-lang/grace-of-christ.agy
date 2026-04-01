'use client';
import { useEffect, useState, useCallback } from 'react';

interface Sermon {
  id: string; title: string; description?: string; videoUrl: string;
  speaker: string; date: string; tags: string[]; isPublished: boolean;
}

const EMPTY: Omit<Sermon, 'id'> = { title: '', description: '', videoUrl: '', speaker: 'Pastor K. John Prasad', date: '', tags: [], isPublished: true };

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [form, setForm] = useState<Omit<Sermon, 'id'>>(EMPTY);
  const [tagsInput, setTagsInput] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const token = () => localStorage.getItem('goc_access_token');

  const fetchSermons = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${API}/sermons?limit=50`, { headers: { Authorization: `Bearer ${token()}` } });
    const data = await res.json();
    setSermons(data.sermons || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSermons(); }, [fetchSermons]);

  const openCreate = () => { setForm(EMPTY); setTagsInput(''); setEditId(null); setShowForm(true); setError(''); };
  const openEdit = (s: Sermon) => { setForm({ title: s.title, description: s.description, videoUrl: s.videoUrl, speaker: s.speaker, date: s.date.split('T')[0], tags: s.tags, isPublished: s.isPublished }); setTagsInput(s.tags.join(', ')); setEditId(s.id); setShowForm(true); setError(''); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const body = { ...form, date: new Date(form.date).toISOString(), tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) };
      const url = editId ? `${API}/sermons/${editId}` : `${API}/sermons`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Save failed');
      setShowForm(false); fetchSermons();
    } catch { setError('Failed to save sermon.'); }
    setSaving(false);
  };

  const deleteSermon = async (id: string) => {
    if (!confirm('Delete this sermon?')) return;
    await fetch(`${API}/sermons/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    fetchSermons();
  };

  const F = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>Sermons</h1>
        <button id="create-sermon-btn" className="btn btn-gold" onClick={openCreate}>+ Add Sermon</button>
      </div>

      {showForm && (
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>{editId ? 'Edit Sermon' : 'Add Sermon'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div><label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>Title *</label><input id="sermon-title" className="input-field" value={form.title} onChange={e => F('title', e.target.value)} /></div>
            <div><label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>Speaker *</label><input id="sermon-speaker" className="input-field" value={form.speaker} onChange={e => F('speaker', e.target.value)} /></div>
            <div><label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>Date *</label><input id="sermon-date" type="date" className="input-field" value={form.date} onChange={e => F('date', e.target.value)} /></div>
            <div><label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>YouTube URL *</label><input id="sermon-video-url" className="input-field" placeholder="https://youtube.com/watch?v=..." value={form.videoUrl} onChange={e => F('videoUrl', e.target.value)} /></div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>Description</label>
            <textarea id="sermon-description" className="input-field" rows={2} value={form.description} onChange={e => F('description', e.target.value)} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>Tags (comma separated)</label>
            <input id="sermon-tags" className="input-field" placeholder="Grace, Faith, Prayer" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input id="sermon-published" type="checkbox" checked={form.isPublished} onChange={e => F('isPublished', e.target.checked)} style={{ accentColor: 'var(--gold)' }} />
            <label htmlFor="sermon-published" style={{ fontSize: '0.85rem', color: 'var(--cream-dim)' }}>Published</label>
          </div>
          {error && <p style={{ color: '#f87171', fontSize: '0.82rem', marginTop: '0.75rem' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button id="save-sermon-btn" className="btn btn-gold" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Sermon'}</button>
            <button className="btn btn-glass" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {loading ? <p style={{ color: 'var(--cream-dim)' }}>Loading...</p>
          : sermons.map(s => (
            <div key={s.id} className="glass" style={{ borderRadius: '14px', overflow: 'hidden' }}>
              <img src={`https://img.youtube.com/vi/${s.videoUrl.split('v=')[1]?.split('&')[0] || ''}/mqdefault.jpg`} alt={s.title} style={{ width: '100%', height: '160px', objectFit: 'cover', opacity: 0.8 }} />
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--cream)', marginBottom: '0.25rem', fontSize: '0.92rem' }}>{s.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', marginBottom: '1rem' }}>{s.speaker} · {new Date(s.date).toLocaleDateString('en-IN')}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button id={`edit-sermon-${s.id}`} className="btn btn-glass" onClick={() => openEdit(s)} style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', flex: 1 }}>✏ Edit</button>
                  <button id={`delete-sermon-${s.id}`} onClick={() => deleteSermon(s.id)} style={{ padding: '0.3rem 0.75rem', background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

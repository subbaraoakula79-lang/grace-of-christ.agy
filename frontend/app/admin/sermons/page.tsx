'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Sermon {
  id: string; title: string; description?: string; videoUrl: string;
  speaker: string; date: string; tags: string[]; isPublished: boolean;
}

const EMPTY: Omit<Sermon, 'id'> = { title: '', description: '', videoUrl: '', speaker: 'Pastor K. John Prasad', date: '', tags: [], isPublished: true };

const defaultSermons: Sermon[] = [
  {
    id: 'serm-1',
    title: 'The Power of Intercessory Prayer',
    description: 'Pastor K. John Prasad shares a powerful message on how intercessory prayer shifts spiritual atmospheres and builds active faith in our community.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    speaker: 'Pastor K. John Prasad',
    date: '2026-06-21',
    tags: ['Prayer', 'Faith', 'Revival'],
    isPublished: true,
  },
  {
    id: 'serm-2',
    title: 'Living in His Amazing Grace',
    description: 'Discover the depth of God\'s grace and how it empowers us to live victorious Christian lives filled with joy and mercy.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    speaker: 'Pastor K. John Prasad',
    date: '2026-06-14',
    tags: ['Grace', 'Victory', 'Salvation'],
    isPublished: true,
  },
  {
    id: 'serm-3',
    title: 'The Calling of the Next Generation',
    description: 'An encouraging message challenging the youth to stand firm in biblical truth, discover their identity, and pursue kingdom purpose.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    speaker: 'Pastor K. John Prasad',
    date: '2026-06-07',
    tags: ['Youth', 'Purpose', 'Calling'],
    isPublished: true,
  }
];

function getYouTubeId(url: string): string {
  const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?/]+)/);
  return match?.[1] || '';
}

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

  const fetchSermons = useCallback(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('goc_sermons');
      if (stored) {
        setSermons(JSON.parse(stored));
      } else {
        localStorage.setItem('goc_sermons', JSON.stringify(defaultSermons));
        setSermons(defaultSermons);
      }
    } catch (err) {
      console.error('Failed to parse local sermons', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  const openCreate = () => { setForm(EMPTY); setTagsInput(''); setEditId(null); setShowForm(true); setError(''); };
  const openEdit = (s: Sermon) => {
    setForm({
      title: s.title,
      description: s.description || '',
      videoUrl: s.videoUrl,
      speaker: s.speaker,
      date: s.date.split('T')[0],
      tags: s.tags,
      isPublished: s.isPublished
    });
    setTagsInput(s.tags.join(', '));
    setEditId(s.id);
    setShowForm(true);
    setError('');
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.videoUrl.trim() || !form.date) {
      setError('Please fill in all required fields.');
      return;
    }
    setSaving(true); setError('');
    
    try {
      const stored = localStorage.getItem('goc_sermons');
      let data: Sermon[] = stored ? JSON.parse(stored) : [];

      const newSermon: Sermon = {
        id: editId || `serm-${Date.now()}`,
        title: form.title,
        description: form.description,
        videoUrl: form.videoUrl,
        speaker: form.speaker || 'Pastor K. John Prasad',
        date: new Date(form.date).toISOString(),
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        isPublished: form.isPublished
      };

      if (editId) {
        data = data.map(s => s.id === editId ? newSermon : s);
      } else {
        data.unshift(newSermon);
      }

      localStorage.setItem('goc_sermons', JSON.stringify(data));
      setShowForm(false);
      fetchSermons();

      // Push to API
      const url = editId ? `${API}/sermons/${editId}` : `${API}/sermons`;
      const method = editId ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(newSermon)
      });
    } catch (err) {
      console.warn('API sync failed, sermon updated locally', err);
      setShowForm(false);
      fetchSermons();
    } finally {
      setSaving(false);
    }
  };

  const deleteSermon = async (id: string) => {
    if (!confirm('Delete this sermon?')) return;
    try {
      const stored = localStorage.getItem('goc_sermons');
      if (stored) {
        const data: Sermon[] = JSON.parse(stored);
        const filtered = data.filter(s => s.id !== id);
        localStorage.setItem('goc_sermons', JSON.stringify(filtered));
      }
      fetchSermons();

      await fetch(`${API}/sermons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` }
      });
    } catch (err) {
      console.warn('API sync failed, sermon deleted locally', err);
    }
  };

  const F = (k: keyof typeof form, v: Sermon[keyof Sermon]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Sermons</h1>
        <button id="create-sermon-btn" className="btn-spatial btn-primary" onClick={openCreate}>+ Add Sermon</button>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="spatial-glass-mid" 
          style={{ padding: '2.5rem', marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.15)' }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{editId ? 'Edit Sermon' : 'Add Sermon'}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Title *</label>
              <input id="sermon-title" className="input-spatial" value={form.title} onChange={e => F('title', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Speaker *</label>
              <input id="sermon-speaker" className="input-spatial" value={form.speaker} onChange={e => F('speaker', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Date *</label>
              <input id="sermon-date" type="date" className="input-spatial" value={form.date} onChange={e => F('date', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>YouTube URL *</label>
              <input id="sermon-video-url" className="input-spatial" placeholder="https://youtube.com/watch?v=..." value={form.videoUrl} onChange={e => F('videoUrl', e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Description</label>
            <textarea id="sermon-description" className="input-spatial" rows={2} value={form.description} onChange={e => F('description', e.target.value)} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Tags (comma separated)</label>
            <input id="sermon-tags" className="input-spatial" placeholder="Grace, Faith, Prayer" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input id="sermon-published" type="checkbox" checked={form.isPublished} onChange={e => F('isPublished', e.target.checked)} style={{ accentColor: 'var(--violet)' }} />
            <label htmlFor="sermon-published" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Published</label>
          </div>
          
          {error && <p style={{ color: '#f87171', fontSize: '0.82rem', marginTop: '1rem', fontWeight: 500 }}>⚠️ {error}</p>}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button id="save-sermon-btn" className="btn-spatial btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Sermon'}</button>
            <button className="btn-spatial btn-glass" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </motion.div>
      )}

      {/* Sermons list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading sermons...</p>
        ) : sermons.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No sermons archived.</p>
        ) : (
          sermons.map(s => {
            const ytId = getYouTubeId(s.videoUrl);
            return (
              <div key={s.id} className="spatial-card" style={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt={s.title} style={{ width: '100%', height: '160px', objectFit: 'cover', opacity: 0.85 }} />
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem', fontSize: '0.95rem', lineHeight: 1.3 }}>{s.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>{s.speaker} · {new Date(s.date).toLocaleDateString('en-IN')}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button id={`edit-sermon-${s.id}`} className="btn-spatial btn-glass" onClick={() => openEdit(s)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', flex: 1 }}>✏ Edit</button>
                    <button id={`delete-sermon-${s.id}`} onClick={() => deleteSermon(s.id)} style={{ padding: '0.4rem 0.75rem', background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' }}>🗑</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

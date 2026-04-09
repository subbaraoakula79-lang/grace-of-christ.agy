'use client';
import { useEffect, useState, useCallback } from 'react';

interface GalleryImage {
  id: string; imageUrl: string; publicId: string; caption?: string; category?: string; createdAt: string;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const token = () => localStorage.getItem('goc_access_token');

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${API}/gallery?limit=48`);
    const data = await res.json();
    setImages(data.images || []);
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true); setMessage('');
    try {
      const formData = new FormData();
      formData.append('image', file);

      const uploadRes = await fetch(`${API}/upload/image`, {
        method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: formData,
      });
      const { url, publicId } = await uploadRes.json();

      await fetch(`${API}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ imageUrl: url, publicId, caption, category }),
      });

      setMessage('✅ Image uploaded successfully!');
      setFile(null); setCaption(''); setCategory('');
      fetchImages();
    } catch { setMessage('❌ Upload failed. Please try again.'); }
    setUploading(false);
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    await fetch(`${API}/gallery/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    fetchImages();
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Gallery</h1>

      {/* Upload Form */}
      <div className="glass" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Upload Image</h2>
        <form onSubmit={handleUpload} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>Image File *</label>
            <input id="gallery-file" type="file" accept="image/*" required
              onChange={e => setFile(e.target.files?.[0] || null)}
              style={{ fontSize: '0.85rem', color: 'var(--cream-dim)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem', cursor: 'pointer' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>Caption</label>
            <input id="gallery-caption" className="input-field" placeholder="Easter Celebration" value={caption} onChange={e => setCaption(e.target.value)} style={{ width: '200px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', display: 'block', marginBottom: '0.4rem' }}>Category</label>
            <input id="gallery-category" className="input-field" placeholder="Worship, Youth..." value={category} onChange={e => setCategory(e.target.value)} style={{ width: '160px' }} />
          </div>
          <button id="upload-image-btn" type="submit" className="btn btn-gold" disabled={uploading || !file}>
            {uploading ? 'Uploading...' : '⬆ Upload'}
          </button>
        </form>
        {message && <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: message.startsWith('✅') ? '#4ade80' : '#f87171' }}>{message}</p>}
      </div>

      {/* Image Grid */}
      {loading ? <p style={{ color: 'var(--cream-dim)' }}>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {images.map(img => {
            let src = img.imageUrl;
            if (src.includes('\\')) {
              src = `${API.replace('/api', '')}/api/upload/local/${src.replace(/\\/g, '/').split('/').pop()}`;
            } else if (src.startsWith('/api')) {
              src = `${API.replace('/api', '')}${src}`;
            } else if (src.startsWith('/uploads')) {
              // Fallback for legacy paths like /uploads/local_123.jpg
              src = `${API.replace('/api', '')}/api/upload/local/${src.split('/').pop()}`;
            }

            return (
              <div key={img.id} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3', backgroundColor: 'rgba(255,255,255,0.05)' }} className="card-hover">
                <img 
                  src={src} 
                  alt={img.caption || 'Gallery'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('data:image')) {
                      target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23222" width="100" height="100"/><text fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-size="14" dy="5" font-weight="bold" x="50%" y="50%" text-anchor="middle">Image Not Found</text></svg>';
                    }
                  }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(7,11,20,0.9) 0%, transparent 50%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0.75rem' }}>
                  {img.caption && <div style={{ fontSize: '0.75rem', color: 'var(--cream)', fontWeight: 500, marginBottom: '0.4rem' }}>{img.caption}</div>}
                  <button id={`delete-img-${img.id}`} onClick={() => deleteImage(img.id)} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.72rem' }}>🗑 Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

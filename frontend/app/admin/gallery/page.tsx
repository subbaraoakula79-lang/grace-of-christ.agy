'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface GalleryImage {
  id: string; imageUrl: string; publicId: string; caption?: string; category?: string; createdAt: string;
}

const defaultImages: GalleryImage[] = [
  {
    id: 'g-1',
    imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800&auto=format&fit=crop',
    publicId: 'worship-1',
    caption: 'Sunday Worship Revival',
    category: 'Worship',
    createdAt: '2026-06-20',
  },
  {
    id: 'g-2',
    imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=800&auto=format&fit=crop',
    publicId: 'prayer-1',
    caption: 'Intercessory Prayer Meeting',
    category: 'Prayer',
    createdAt: '2026-06-18',
  },
  {
    id: 'g-3',
    imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad58565b90?q=80&w=800&auto=format&fit=crop',
    publicId: 'bible-1',
    caption: 'Weekly Discipleship Group',
    category: 'Bible Study',
    createdAt: '2026-06-15',
  },
  {
    id: 'g-4',
    imageUrl: 'https://images.unsplash.com/photo-1461530751291-6897f0a44c41?q=80&w=800&auto=format&fit=crop',
    publicId: 'community-1',
    caption: 'Youth Outreach Program',
    category: 'Outreach',
    createdAt: '2026-06-12',
  },
  {
    id: 'g-5',
    imageUrl: 'https://images.unsplash.com/photo-1438263308945-858e2f679b92?q=80&w=800&auto=format&fit=crop',
    publicId: 'cross-1',
    caption: 'Easter Celebration Service',
    category: 'Worship',
    createdAt: '2026-06-10',
  },
  {
    id: 'g-6',
    imageUrl: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=800&auto=format&fit=crop',
    publicId: 'church-1',
    caption: 'GOC Yetimoga Sanctuary',
    category: 'Church',
    createdAt: '2026-06-05',
  }
];

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

  const fetchImages = useCallback(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('goc_gallery');
      if (stored) {
        setImages(JSON.parse(stored));
      } else {
        localStorage.setItem('goc_gallery', JSON.stringify(defaultImages));
        setImages(defaultImages);
      }
    } catch (err) {
      console.error('Failed to parse local gallery', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true); setMessage('');
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        const newImage: GalleryImage = {
          id: `img-${Date.now()}`,
          imageUrl: base64,
          publicId: `local-${Date.now()}`,
          caption,
          category,
          createdAt: new Date().toISOString()
        };

        const stored = localStorage.getItem('goc_gallery');
        const data: GalleryImage[] = stored ? JSON.parse(stored) : [];
        data.unshift(newImage);
        localStorage.setItem('goc_gallery', JSON.stringify(data));

        setMessage('✅ Image uploaded successfully!');
        setFile(null); setCaption(''); setCategory('');
        setUploading(false);
        fetchImages();

        // Async API upload
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
        } catch {}
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setMessage('❌ Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      const stored = localStorage.getItem('goc_gallery');
      if (stored) {
        const data: GalleryImage[] = JSON.parse(stored);
        const filtered = data.filter(img => img.id !== id);
        localStorage.setItem('goc_gallery', JSON.stringify(filtered));
      }
      fetchImages();

      await fetch(`${API}/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` }
      });
    } catch (err) {
      console.warn('API sync failed, image deleted locally', err);
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--text-primary)' }}>Gallery</h1>

      {/* Upload Form */}
      <div className="spatial-glass-mid" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '2.5rem', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Upload Image</h2>
        <form onSubmit={handleUpload} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Image File *</label>
            <input id="gallery-file" type="file" accept="image/*" required
              onChange={e => setFile(e.target.files?.[0] || null)}
              style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '0.6rem 0.85rem', cursor: 'pointer' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Caption</label>
            <input id="gallery-caption" className="input-spatial" placeholder="Easter Celebration" value={caption} onChange={e => setCaption(e.target.value)} style={{ width: '200px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Category</label>
            <input id="gallery-category" className="input-spatial" placeholder="Worship, Youth..." value={category} onChange={e => setCategory(e.target.value)} style={{ width: '160px' }} />
          </div>
          <button id="upload-image-btn" type="submit" className="btn-spatial btn-primary" disabled={uploading || !file}>
            {uploading ? 'Uploading...' : 'Upload ⬆'}
          </button>
        </form>
        {message && <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: message.startsWith('✅') ? '#34D399' : '#f87171', fontWeight: 600 }}>{message}</p>}
      </div>

      {/* Image Grid */}
      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading gallery images...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
          {images.map(img => {
            let src = img.imageUrl;
            if (src.includes('\\')) {
              src = `${API.replace('/api', '')}/api/upload/local/${src.replace(/\\/g, '/').split('/').pop()}`;
            } else if (src.startsWith('/api')) {
              src = `${API.replace('/api', '')}${src}`;
            } else if (src.startsWith('/uploads')) {
              src = `${API.replace('/api', '')}/api/upload/local/${src.split('/').pop()}`;
            }

            return (
              <div key={img.id} style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.03)' }} className="spatial-card">
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
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(7,13,12,0.9) 0%, transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0.85rem' }}>
                  {img.caption && <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 600, marginBottom: '0.45rem' }}>{img.caption}</div>}
                  <button id={`delete-img-${img.id}`} onClick={() => deleteImage(img.id)} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', borderRadius: '6px', padding: '0.3rem 0.65rem', cursor: 'pointer', fontSize: '0.72rem' }}>🗑 Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

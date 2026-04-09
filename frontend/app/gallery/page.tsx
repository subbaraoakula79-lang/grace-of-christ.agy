'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface GalleryImage {
  id: string;
  imageUrl: string;
  publicId: string;
  caption?: string;
  category?: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API}/gallery?limit=48`);
        const data = await res.json();
        setImages(data.images || []);
      } catch (err) {
        console.error('Failed to fetch gallery images', err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [API]);

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="gradient-hero" style={{ paddingTop: '140px', paddingBottom: '5rem', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label" style={{ justifyContent: 'center' }}>Memories</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Church <span className="text-gradient-gold">Gallery</span>
          </h1>
          <p style={{ color: 'var(--cream-dim)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>
            Moments of worship, fellowship, and ministry captured through the lens of our church family.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section" style={{ background: 'var(--midnight)', minHeight: '50vh' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--cream-dim)' }}>
              Loading gallery...
            </div>
          ) : images.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', paddingBottom: '3rem' }}>
              {images.map((img) => {
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
                  <div key={img.id} className="card-hover" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <img 
                      src={src} 
                      alt={img.caption || 'Gallery Image'} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      loading="lazy" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('data:image')) {
                          target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23222" width="100" height="100"/><text fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-size="14" dy="5" font-weight="bold" x="50%" y="50%" text-anchor="middle">Image Not Found</text></svg>';
                        }
                      }}
                    />
                    {(img.caption || img.category) && (
                       <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(7,11,20,0.9) 0%, transparent 50%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.25rem' }}>
                         {img.caption && <div style={{ fontSize: '1.1rem', color: 'var(--cream)', fontWeight: 500, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{img.caption}</div>}
                         {img.category && <div style={{ fontSize: '0.8rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', margin: '0.2rem' }}>{img.category}</div>}
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(212,175,55,0.2)', borderRadius: '24px', padding: '4rem 3rem', maxWidth: '480px' }}>
                <div style={{ fontSize: '3.5rem', opacity: 0.5 }}>🖼</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--cream)', margin: 0 }}>
                  Coming Soon
                </h2>
                <p style={{ color: 'var(--cream-dim)', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
                  Photos will be added here soon. Visit the admin panel to upload gallery images.
                </p>
                <a href="/admin/login" className="btn btn-outline-gold" style={{ marginTop: '0.5rem' }}>
                  Admin Panel
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

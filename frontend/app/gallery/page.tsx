'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface GalleryImage {
  id: string;
  imageUrl: string;
  publicId: string;
  caption?: string;
  category?: string;
  createdAt: string;
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

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const stored = localStorage.getItem('goc_gallery');
        let currentImages = defaultImages;
        if (stored) {
          currentImages = JSON.parse(stored);
        } else {
          localStorage.setItem('goc_gallery', JSON.stringify(defaultImages));
        }
        setImages(currentImages);

        const res = await fetch(`${API}/gallery?limit=48`);
        if (res.ok) {
          const data = await res.json();
          if (data.images && data.images.length > 0) {
            setImages(data.images);
            localStorage.setItem('goc_gallery', JSON.stringify(data.images));
          }
        }
      } catch (err) {
        console.warn('Backend API offline, using local storage fallback.', err);
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
      <section className="page-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-label">Memories</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem' }}>
              Church <span className="accent-text">Gallery</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>
              Moments of worship, fellowship, and ministry captured through the lens of our church family.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section" style={{ background: 'var(--space-mid)', minHeight: '60vh', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '10%', right: '-15%',
          width: '450px', height: '450px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05), transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none'
        }} />

        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
              Loading gallery...
            </div>
          ) : images.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', paddingBottom: '3rem' }}>
              {images.map((img, idx) => {
                let src = img.imageUrl;
                if (src.includes('\\')) {
                  src = `${API.replace('/api', '')}/api/upload/local/${src.replace(/\\/g, '/').split('/').pop()}`;
                } else if (src.startsWith('/api')) {
                  src = `${API.replace('/api', '')}${src}`;
                } else if (src.startsWith('/uploads')) {
                  src = `${API.replace('/api', '')}/api/upload/local/${src.split('/').pop()}`;
                }
                
                return (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    onClick={() => setSelectedImage({ ...img, imageUrl: src })}
                    className="spatial-card"
                    style={{
                      position: 'relative',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      aspectRatio: '4/3',
                      border: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.03)',
                      cursor: 'pointer'
                    }}
                  >
                    <img 
                      src={src} 
                      alt={img.caption || 'Gallery Image'} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                      className="gallery-image-hover"
                      loading="lazy" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('data:image')) {
                          target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23222" width="100" height="100"/><text fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-size="14" dy="5" font-weight="bold" x="50%" y="50%" text-anchor="middle">Image Not Found</text></svg>';
                        }
                      }}
                    />
                    {(img.caption || img.category) && (
                       <div style={{
                         position: 'absolute', inset: 0,
                         background: 'linear-gradient(0deg, rgba(7,13,12,0.8) 0%, transparent 60%)',
                         display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem',
                         transition: 'opacity 0.3s ease'
                       }}>
                         {img.caption && <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{img.caption}</div>}
                         {img.category && <div style={{ fontSize: '0.72rem', color: 'var(--violet)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.3rem', fontWeight: 700 }}>{img.category}</div>}
                       </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div
                className="spatial-glass-mid"
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.5rem',
                  border: '1px dashed rgba(16, 185, 129, 0.2)',
                  padding: '4rem 3rem',
                  maxWidth: '480px',
                  margin: '0 auto'
                }}
              >
                <div style={{ fontSize: '3.5rem', opacity: 0.5 }}>🖼</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Coming Soon
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
                  Photos will be added here soon. Visit the admin panel to upload gallery images.
                </p>
                <Link href="/admin/login" className="btn-spatial btn-outline" style={{ marginTop: '0.5rem' }}>
                  Admin Panel
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1100,
              background: 'rgba(7, 13, 12, 0.95)',
              backdropFilter: 'blur(16px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '2rem', cursor: 'zoom-out'
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '90vw', maxHeight: '75vh',
                borderRadius: '24px', overflow: 'hidden',
                boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <img 
                src={selectedImage.imageUrl} 
                alt={selectedImage.caption || 'Expanded view'} 
                style={{ maxWidth: '100%', maxHeight: '75vh', display: 'block', objectFit: 'contain' }} 
              />
              
              <button 
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'absolute', top: '1.25rem', right: '1.25rem',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(7, 13, 12, 0.6)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', fontSize: '1.2rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.6)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(7, 13, 12, 0.6)'}
              >
                ✕
              </button>

              {(selectedImage.caption || selectedImage.category) && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(0deg, rgba(7,13,12,0.95) 0%, rgba(7,13,12,0.6) 80%, transparent 100%)',
                  padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)'
                }}>
                  {selectedImage.caption && <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 600, margin: 0 }}>{selectedImage.caption}</h3>}
                  {selectedImage.category && <span style={{ fontSize: '0.78rem', color: 'var(--violet)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, display: 'inline-block', marginTop: '0.4rem' }}>{selectedImage.category}</span>}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

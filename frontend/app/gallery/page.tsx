'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryAPI } from '@/lib/api';

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
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Derive base URL the same way api.ts does, so public gallery and admin
  // gallery always hit the exact same endpoint regardless of how Vercel's
  // NEXT_PUBLIC_API_URL env var is set (with or without trailing /api).
  let API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  if (API && !API.endsWith('/api') && !API.endsWith('/api/')) {
    API = `${API.replace(/\/+$/, '')}/api`;
  }

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        // Use the shared galleryAPI helper (same as admin) so URL construction
        // is always identical — this was the root cause of public gallery not
        // showing images while admin gallery did.
        const res = await galleryAPI.list({ limit: 48 });
        setImages(res.data.images ?? []);
      } catch (err) {
        console.warn('Gallery fetch failed:', err);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

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
                  Gallery
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
                  No gallery images available yet. Please check back later.
                </p>
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

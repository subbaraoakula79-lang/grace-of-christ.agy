'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Sermon {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  speaker: string;
  date: string;
  tags: string[];
  isPublished: boolean;
}

const defaultSermons: Sermon[] = [];


function getYouTubeId(url: string): string {
  const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?/]+)/);
  return match?.[1] || '';
}

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const stored = localStorage.getItem('goc_sermons');
        let currentSermons = defaultSermons;
        if (stored) {
          currentSermons = JSON.parse(stored);
        } else {
          localStorage.setItem('goc_sermons', JSON.stringify(defaultSermons));
        }

        if (search) {
          const sLower = search.toLowerCase();
          currentSermons = currentSermons.filter(s => 
            s.title.toLowerCase().includes(sLower) || 
            s.speaker.toLowerCase().includes(sLower) ||
            s.tags.some(t => t.toLowerCase().includes(sLower)) ||
            (s.description && s.description.toLowerCase().includes(sLower))
          );
        }
        setSermons(currentSermons);

        // Try API
        const params = new URLSearchParams({ limit: '24', ...(search && { search }) });
        const res = await fetch(`${API}/sermons?${params}`);
        if (res.ok) {
          const data = await res.json();
          if (data.sermons && data.sermons.length > 0) {
            setSermons(data.sermons);
            if (!search) {
              localStorage.setItem('goc_sermons', JSON.stringify(data.sermons));
            }
          }
        }
      } catch (err) {
        console.warn('Backend API offline, using local storage fallback.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, [API, search]);

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
            <div className="section-label">The Word</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem' }}>
              Message <span className="accent-text">Archive</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 2rem', lineHeight: 1.8 }}>
              Be fed by the Word of God. Watch and listen to past sermons from Pastor K. John Prasad.
            </p>
            {/* Search */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <input
                type="text"
                placeholder="🔍 Search sermons..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-spatial"
                style={{ maxWidth: '400px', width: '100%', borderRadius: 'var(--r-pill)', background: 'rgba(255, 255, 255, 0.05)' }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sermons Grid */}
      <section className="section" style={{ background: 'var(--space-mid)', minHeight: '60vh', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '-15%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05), transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none'
        }} />

        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>Loading sermons...</div>
          ) : sermons.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem', paddingBottom: '3rem' }}>
              {sermons.map((s, idx) => {
                const ytId = getYouTubeId(s.videoUrl);
                return (
                  <motion.a
                    key={s.id}
                    href={s.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className="spatial-card"
                    style={{ overflow: 'hidden', textDecoration: 'none', display: 'block', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                      <img
                        src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                        alt={s.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        className="sermon-thumbnail"
                        loading="lazy"
                      />
                      <div style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', background: 'rgba(7, 13, 12, 0.35)', transition: 'background 0.3s'
                      }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: '50%', background: 'var(--violet)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: '#FFF',
                          boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
                        }}>▶</div>
                      </div>
                    </div>
                    <div style={{ padding: '1.75rem' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem', lineHeight: 1.3 }}>{s.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        {s.speaker} · {new Date(s.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                      {s.description && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {s.description}
                        </p>
                      )}
                      {s.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {s.tags.map(tag => (
                            <span
                              key={tag}
                              className="spatial-glass"
                              style={{
                                fontSize: '0.7rem',
                                padding: '0.25rem 0.75rem',
                                borderRadius: 9999,
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                color: 'var(--violet)',
                                fontWeight: 600
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.a>
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
                <div style={{ fontSize: '3.5rem', opacity: 0.5 }}>🎙</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>No Sermons Found</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
                  {search ? `No sermons match your search term "${search}".` : 'Sermons will be added here soon. Check back later.'}
                </p>
                <Link href="/contact" className="btn-spatial btn-outline" style={{ marginTop: '0.5rem' }}>Contact Us</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

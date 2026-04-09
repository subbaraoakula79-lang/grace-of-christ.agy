'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
        const params = new URLSearchParams({ limit: '24', ...(search && { search }) });
        const res = await fetch(`${API}/sermons?${params}`);
        const data = await res.json();
        setSermons(data.sermons || []);
      } catch (err) {
        console.error('Failed to fetch sermons', err);
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
      <section className="gradient-hero" style={{ paddingTop: '140px', paddingBottom: '5rem', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label" style={{ justifyContent: 'center' }}>The Word</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Message <span className="text-gradient-gold">Archive</span>
          </h1>
          <p style={{ color: 'var(--cream-dim)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>
            Be fed by the Word of God. Watch and listen to past sermons from Pastor K. John Prasad.
          </p>
          {/* Search */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <input
              type="text"
              placeholder="🔍 Search sermons..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field"
              style={{ maxWidth: '400px', width: '100%' }}
            />
          </div>
        </div>
      </section>

      {/* Sermons Grid */}
      <section className="section" style={{ background: 'var(--midnight)', minHeight: '50vh' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--cream-dim)' }}>Loading sermons...</div>
          ) : sermons.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem', paddingBottom: '3rem' }}>
              {sermons.map(s => {
                const ytId = getYouTubeId(s.videoUrl);
                return (
                  <a key={s.id} href={s.videoUrl} target="_blank" rel="noopener noreferrer"
                    className="glass card-hover"
                    style={{ borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', display: 'block' }}>
                    <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                      <img
                        src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                        alt={s.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', transition: 'background 0.2s' }}>
                        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(212,175,55,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>▶</div>
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--cream)', marginBottom: '0.4rem', lineHeight: 1.3 }}>{s.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', marginBottom: '0.75rem' }}>
                        {s.speaker} · {new Date(s.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                      {s.description && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--cream-dim)', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                          {s.description}
                        </p>
                      )}
                      {s.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {s.tags.map(tag => (
                            <span key={tag} style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: 9999, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: 'var(--gold)' }}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(212,175,55,0.2)', borderRadius: '24px', padding: '4rem 3rem', maxWidth: '480px' }}>
                <div style={{ fontSize: '3.5rem', opacity: 0.5 }}>🎙</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--cream)', margin: 0 }}>Coming Soon</h2>
                <p style={{ color: 'var(--cream-dim)', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
                  {search ? `No sermons found for "${search}". Try a different search.` : 'Sermons will be added here soon. Check back later.'}
                </p>
                <a href="/contact" className="btn btn-outline-gold" style={{ marginTop: '0.5rem' }}>Contact Us</a>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}


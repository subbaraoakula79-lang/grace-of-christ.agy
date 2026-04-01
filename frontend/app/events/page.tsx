'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isPublished: boolean;
}

const categoryColors: Record<string, string> = {
  Worship: '#7B5EA7',
  Special: '#D4AF37',
  Youth: '#22c55e',
  "Women's": '#C9848A',
  Outreach: '#3B82F6',
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API}/events?upcoming=true&limit=20`);
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [API]);

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="gradient-hero" style={{ paddingTop: '140px', paddingBottom: '5rem', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label" style={{ justifyContent: 'center' }}>Stay Connected</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Upcoming <span className="text-gradient-gold">Events</span>
          </h1>
          <p style={{ color: 'var(--cream-dim)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.8 }}>
            Join us for worship services, special celebrations, and community gatherings. All are welcome.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section" style={{ background: 'var(--midnight)', minHeight: '50vh' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--cream-dim)' }}>Loading events...</div>
          ) : events.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem', paddingBottom: '3rem' }}>
              {events.map(ev => {
                const isUpcoming = new Date(ev.date) >= new Date();
                const accentColor = 'var(--gold)';
                return (
                  <article key={ev.id} className="glass card-hover" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <div style={{ height: '4px', background: accentColor }} />
                    <div style={{ padding: '1.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.72rem', padding: '0.25rem 0.75rem', borderRadius: 9999, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: 'var(--gold)', letterSpacing: '0.05em', fontWeight: 600 }}>Church Event</span>
                        {isUpcoming && <span style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 600, letterSpacing: '0.05em' }}>● UPCOMING</span>}
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--cream)', marginBottom: '0.75rem', lineHeight: 1.3 }}>{ev.title}</h2>
                      <p style={{ fontSize: '0.87rem', color: 'var(--cream-dim)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{ev.description}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--cream-dim)' }}>📅 <strong style={{ color: 'var(--gold)' }}>{new Date(ev.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--cream-dim)' }}>🕐 {ev.time}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--cream-dim)' }}>📍 {ev.location}</div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(212,175,55,0.2)', borderRadius: '24px', padding: '4rem 3rem', maxWidth: '480px' }}>
                <div style={{ fontSize: '3.5rem', opacity: 0.5 }}>📅</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--cream)', margin: 0 }}>No Upcoming Events</h2>
                <p style={{ color: 'var(--cream-dim)', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
                  No events scheduled at the moment. Check back soon or contact us for information about services.
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


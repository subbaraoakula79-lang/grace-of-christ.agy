'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isPublished: boolean;
}

const defaultEvents: Event[] = [
  {
    id: 'ev-1',
    title: 'Sunday Worship & Revival Service',
    description: 'Join us for an uplifting time of praise, worship, and a powerful message of hope from Pastor K. John Prasad.',
    date: '2026-07-05',
    time: '6:00 AM & 9:30 AM',
    location: 'Yetimoga, Kakinada',
    isPublished: true,
  },
  {
    id: 'ev-2',
    title: 'Midweek Intercessory Prayer Meeting',
    description: 'A special time dedicated to corporate intercession for our nation, families, and personal prayer requests.',
    date: '2026-07-08',
    time: '6:30 PM',
    location: 'Yetimoga, Kakinada',
    isPublished: true,
  },
  {
    id: 'ev-3',
    title: 'Youth Awakening Conference 2026',
    description: 'An annual gathering of young believers across Andhra Pradesh focused on revival, purpose, and biblical discipleship.',
    date: '2026-08-14',
    time: '9:00 AM – 4:00 PM',
    location: 'Grace of Christ Church Grounds',
    isPublished: true,
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const stored = localStorage.getItem('goc_events');
        let currentEvents = defaultEvents;
        if (stored) {
          currentEvents = JSON.parse(stored);
        } else {
          localStorage.setItem('goc_events', JSON.stringify(defaultEvents));
        }
        setEvents(currentEvents);

        // Try to fetch from backend
        const res = await fetch(`${API}/events`);
        if (res.ok) {
          const data = await res.json();
          if (data.events && data.events.length > 0) {
            setEvents(data.events);
            localStorage.setItem('goc_events', JSON.stringify(data.events));
          }
        }
      } catch (err) {
        console.warn('Backend API offline, using local storage fallback.', err);
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
      <section className="page-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-label">Stay Connected</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem' }}>
              Upcoming <span className="accent-text">Events</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.8 }}>
              Join us for worship services, special celebrations, and community gatherings. All are welcome.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section" style={{ background: 'var(--space-mid)', minHeight: '60vh', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '10%', right: '-15%',
          width: '450px', height: '450px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.05), transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none'
        }} />

        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>Loading events...</div>
          ) : events.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem', paddingBottom: '3rem' }}>
              {events.map((ev, idx) => {
                const isUpcoming = new Date(ev.date) >= new Date();
                return (
                  <motion.article
                    key={ev.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className="spatial-card"
                    style={{ overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--violet), var(--amber))' }} />
                    <div style={{ padding: '2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <span
                          className="spatial-glass"
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.35rem 0.85rem',
                            borderRadius: 9999,
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            color: 'var(--violet)',
                            letterSpacing: '0.05em',
                            fontWeight: 600
                          }}
                        >
                          Church Event
                        </span>
                        {isUpcoming && <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700, letterSpacing: '0.05em' }}>● UPCOMING</span>}
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.3 }}>{ev.title}</h2>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.75rem' }}>{ev.description}</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>📅</span>
                          <strong style={{ color: 'var(--text-primary)' }}>
                            {new Date(ev.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </strong>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>🕐</span>
                          <span>{ev.time}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>📍</span>
                          <span>{ev.location}</span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
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
                <div style={{ fontSize: '3.5rem', opacity: 0.5 }}>📅</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>No Upcoming Events</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
                  No events scheduled at the moment. Check back soon or contact us for information about services.
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

'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';

const timeline = [
  { year: '1998', event: 'Grace of Christ founded in Yetimoga with a small prayer group of faithful believers.' },
  { year: '2004', event: '1st Church building completed through the provision of God and community generosity.' },
  { year: '2012', event: 'Launch of outreach ministry and daily prayer programs.' },
  { year: '2018', event: '2nd Church building established to serve the growing congregation.' },
  { year: '2024', event: 'Continuing to grow in faith, love, and service to Kakinada and beyond.' },
];

const values = [
  { icon: '📖', title: 'Word-Centered', desc: 'The Bible is our foundation and final authority for faith and practice.' },
  { icon: '🕊️', title: 'Spirit-Filled', desc: 'We believe in the active work of the Holy Spirit in every believer\'s life.' },
  { icon: '💒', title: 'Community-Driven', desc: 'Church is family. We do life together — in joy and in sorrow.' },
  { icon: '🌍', title: 'Mission-Minded', desc: 'Called to share the love of Christ beyond our walls into all the world.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-label">Who We Are</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem' }}>
              About <span className="accent-text">Grace of Christ</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>
              A spirit-filled congregation in Yetimoga, Kakinada — built on grace, rooted in love, and called to serve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pastor Section */}
      <section className="section" style={{ background: 'var(--space-mid)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '10%', right: '-10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05), transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none'
        }} />

        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            {/* Pastor Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="spatial-glass-mid"
              style={{ padding: '3rem 2rem', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.15)' }}
            >
              <div style={{
                width: 120, height: 120, borderRadius: '50%', margin: '0 auto 1.5rem',
                background: 'linear-gradient(135deg, var(--violet), var(--amber))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)'
              }}>👤</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Pastor K. John Prasad</div>
              <div style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--violet)', marginBottom: '1.5rem', fontWeight: 600 }}>Senior Pastor · Grace of Christ</div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.92rem' }}>
                With a heart burning for revival and a dedication to the Word of God, Pastor K. John Prasad has faithfully led Grace of Christ Church since its founding. His ministry is marked by passionate preaching, intercessory prayer, and a deep love for the people of Kakinada.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.8rem', flexWrap: 'wrap' }}>
                <span className="spatial-glass" style={{ padding: '0.4rem 1rem', borderRadius: 9999, fontSize: '0.78rem', color: 'var(--violet)', border: '1px solid rgba(16,185,129,0.2)' }}>📍 Yetimoga, Kakinada</span>
                <span className="spatial-glass" style={{ padding: '0.4rem 1rem', borderRadius: 9999, fontSize: '0.78rem', color: 'var(--amber)', border: '1px solid rgba(192,132,252,0.2)' }}>✝ Ordained Minister</span>
              </div>
            </motion.div>

            {/* Church Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="section-label">Our Foundation</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, marginBottom: '1.25rem' }}>
                Building Lives on <span className="accent-text">Eternal Truth</span>
              </h2>
              <span className="divider-accent" />
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '1rem', fontSize: '0.95rem' }}>
                Grace of Christ Church (GOC) is located in Yetimoga, Kakinada, Andhra Pradesh. We are a New Testament church that believes in the complete authority of Scripture, the power of the Holy Spirit, and the transforming grace of Jesus Christ.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '2rem', fontSize: '0.95rem' }}>
                Our two church buildings host multiple prayer services every Sunday, welcoming believers and seekers alike to encounter the living God.
              </p>

              {/* Prayer Timings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                  { label: '1st Prayer — 2nd Church', time: '6:00 AM – 9:30 AM', glow: 'rgba(16, 185, 129, 0.12)' },
                  { label: '2nd Prayer — 1st Church', time: '9:30 AM – 12:30 PM', glow: 'rgba(192, 132, 252, 0.12)' },
                ].map(p => (
                  <div key={p.label} className="spatial-card" style={{ padding: '1.1rem 1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${p.glow}` }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.label}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{p.time}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn-spatial btn-primary">Visit Us</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section" style={{ background: 'var(--space)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label">What We Believe</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}>
              Our Core <span className="accent-text">Values</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {values.map((v, idx) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="spatial-card"
                style={{ padding: '2.5rem 2rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div style={{ fontSize: '2.4rem', marginBottom: '1.2rem' }}>{v.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>{v.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ background: 'var(--space-mid)', position: 'relative' }}>
        <div style={{
          position: 'absolute', bottom: '10%', left: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.05), transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none'
        }} />

        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label">Our Journey</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}>
              Church <span className="accent-text">History</span>
            </h2>
          </div>
          <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '80px', top: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg, transparent, rgba(16,185,129,0.3), transparent)' }} />
            {timeline.map((t, idx) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                style={{ display: 'flex', gap: '2.25rem', marginBottom: '2rem', alignItems: 'flex-start' }}
              >
                <div style={{ minWidth: '72px', textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--violet)', paddingTop: '0.15rem' }}>{t.year}</div>
                <div style={{ position: 'relative', flexGrow: 1 }}>
                  <div style={{ position: 'absolute', left: '-2.1rem', top: '0.65rem', width: 10, height: 10, borderRadius: '50%', background: 'var(--violet)', boxShadow: '0 0 10px var(--violet)' }} />
                  <div className="spatial-card" style={{ padding: '1.25rem 1.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{t.event}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ministries = [
  { icon: '🙏', title: 'Prayer Ministry', desc: 'Interceding for the city, nation, and world through daily corporate prayer.' },
  { icon: '🎵', title: 'Worship Ministry', desc: 'Leading hearts into the presence of God through music and praise.' },
  { icon: '👨‍👩‍👧‍👦', title: 'Family Ministry', desc: 'Strengthening marriages, parenting, and family bonds in biblical truth.' },
  { icon: '🌱', title: 'Youth Ministry', desc: 'Raising up the next generation for purpose, identity, and kingdom impact.' },
  { icon: '📖', title: "Women’s Ministry", desc: 'Empowering women to walk in their God-given calling and community.' },
  { icon: '🤝', title: 'Outreach Ministry', desc: 'Serving the poor, preaching the gospel, and transforming communities.' },
];

const stats = [
  { number: '25+', label: 'Years of Ministry' },
  { number: '500+', label: 'Church Members' },
  { number: '2', label: 'Church Buildings' },
  { number: '∞', label: "God's Grace" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />

      {/* ── About Snippet ─────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--space-mid)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative subtle gradient background circle */}
        <div style={{
          position: 'absolute', top: '10%', left: '-10%',
          width: '450px', height: '450px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.06), transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none'
        }} />

        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="section-label">Our Story</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '1.25rem' }}>
                A Church Built on <span className="accent-text">Grace & Faith</span>
              </h2>
              <span className="divider-accent" />
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '1rem', fontSize: '0.95rem' }}>
                Grace of Christ Church stands as a beacon of hope in Yetimoga, Kakinada. Founded on the enduring Word of God, our congregation is a diverse family united by faith in Jesus Christ.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '2rem', fontSize: '0.95rem' }}>
                Under the faithful leadership of <strong style={{ color: 'var(--text-primary)' }}>Pastor K. John Prasad</strong>, we believe in the transformative power of prayer, worship, and community service.
              </p>
              <Link href="/about" className="btn-spatial btn-outline">Learn More About Us</Link>
            </motion.div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {stats.map((s, idx) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="spatial-card"
                  style={{ padding: '2rem 1.5rem', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.12)' }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 700, color: 'var(--violet)', lineHeight: 1 }}>{s.number}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.08em', marginTop: '0.6rem', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Ministries Preview ────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--space)', position: 'relative' }}>
        <div style={{
          position: 'absolute', bottom: '0%', right: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.05), transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none'
        }} />

        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label">What We Do</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}>
              Our <span className="accent-text">Ministries</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {ministries.map((m, idx) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: idx * 0.08 }}
                className="spatial-card"
                style={{ padding: '2.2rem 1.8rem', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '1.2rem' }}>{m.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>{m.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{m.desc}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link href="/ministries" className="btn-spatial btn-outline">View All Ministries</Link>
          </div>
        </div>
      </section>

      {/* ── Donate CTA ───────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--space-light)', position: 'relative', borderTop: '1px solid rgba(16, 185, 129, 0.08)' }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="spatial-glass-mid"
            style={{ padding: '4rem 2.5rem', border: '1px solid rgba(16, 185, 129, 0.15)', maxWidth: '800px', margin: '0 auto' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
            <div className="section-label">Support the Church</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, marginBottom: '1.2rem' }}>
              Give to <span className="accent-text">God&apos;s Kingdom</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto 2.5rem', lineHeight: 1.9, fontSize: '0.95rem' }}>
              Your generous offering helps us serve our community, support ministry programs, and declare the Good News across Andhra Pradesh.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/donate" className="btn-spatial btn-primary">Make a Donation</Link>
              <Link href="/contact" className="btn-spatial btn-glass">Contact Us</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}

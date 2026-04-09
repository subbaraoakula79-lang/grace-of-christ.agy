import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = { title: 'About Us' };

const timeline = [
  { year: '1998', event: 'Grace of Christ founded in Yetimoga with a small prayer group of faithful believers.' },
  { year: '2004', event: '1st Church building completed through the provision of God and community generosity.' },
  { year: '2012', event: 'Launch of outreach ministry and daily prayer programs.' },
  { year: '2018', event: '2nd Church building established to serve the growing congregation.' },
  { year: '2024', event: 'Continuing to grow in faith, love, and service to Kakinada and beyond.' },
];

const values = [
  { icon: '📖', title: 'Word-Centered', desc: 'The Bible is our foundation and final authority for faith and practice.' },
  { icon: '🕊️', title: 'Spirit-Filled', desc: 'We believe in the active work of the Holy Spirit in every believer life.' },
  { icon: '💒', title: 'Community-Driven', desc: 'Church is family. We do life together — in joy and in sorrow.' },
  { icon: '🌍', title: 'Mission-Minded', desc: 'Called to share the love of Christ beyond our walls into all the world.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="gradient-hero" style={{ paddingTop: '140px', paddingBottom: '5rem', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label" style={{ justifyContent: 'center' }}>Who We Are</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem' }}>
            About <span className="text-gradient-gold">Grace of Christ</span>
          </h1>
          <p style={{ color: 'var(--cream-dim)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>
            A spirit-filled congregation in Yetimoga, Kakinada — built on grace, rooted in love, and called to serve.
          </p>
        </div>
      </section>

      {/* Pastor Section */}
      <section className="section gradient-section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            {/* Pastor Card */}
            <div className="glass-royal" style={{ padding: '3rem', textAlign: 'center', borderRadius: '20px' }}>
              <div style={{
                width: 120, height: 120, borderRadius: '50%', margin: '0 auto 1.5rem',
                background: 'linear-gradient(135deg, #7B5EA7, #D4AF37)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem',
              }}>👤</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--cream)', marginBottom: '0.25rem' }}>Pastor K. John Prasad</div>
              <div style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>Senior Pastor · Grace of Christ</div>
              <p style={{ color: 'var(--cream-dim)', lineHeight: 1.8, fontSize: '0.92rem' }}>
                With a heart burning for revival and a dedication to the Word of God, Pastor K. John Prasad has faithfully led Grace of Christ Church since its founding. His ministry is marked by passionate preaching, intercessory prayer, and a deep love for the people of Kakinada.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <span className="glass" style={{ padding: '0.4rem 1rem', borderRadius: 9999, fontSize: '0.78rem', color: 'var(--gold)' }}>📍 Yetimoga, Kakinada</span>
                <span className="glass" style={{ padding: '0.4rem 1rem', borderRadius: 9999, fontSize: '0.78rem', color: 'var(--gold)' }}>✝ Ordained Minister</span>
              </div>
            </div>

            {/* Church Info */}
            <div>
              <div className="section-label">Our Foundation</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, marginBottom: '1.25rem' }}>
                Building Lives on <span className="text-gradient-gold">Eternal Truth</span>
              </h2>
              <span className="divider-gold" />
              <p style={{ color: 'var(--cream-dim)', lineHeight: 1.9, marginBottom: '1rem', fontSize: '0.95rem' }}>
                Grace of Christ Church (GOC) is located in Yetimoga, Kakinada, Andhra Pradesh. We are a New Testament church that believes in the complete authority of Scripture, the power of the Holy Spirit, and the transforming grace of Jesus Christ.
              </p>
              <p style={{ color: 'var(--cream-dim)', lineHeight: 1.9, marginBottom: '2rem', fontSize: '0.95rem' }}>
                Our two church buildings host multiple prayer services every Sunday, welcoming believers and seekers alike to encounter the living God.
              </p>

              {/* Prayer Timings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                  { label: '1st Prayer — 2nd Church', time: '6:00 AM – 9:30 AM' },
                  { label: '2nd Prayer — 1st Church', time: '9:30 AM – 12:30 PM' },
                ].map(p => (
                  <div key={p.label} className="glass-gold" style={{ padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--cream-dim)' }}>{p.label}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--gold)', fontSize: '1.05rem' }}>{p.time}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn btn-gold">Visit Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section" style={{ background: 'var(--midnight)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>What We Believe</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}>
              Our Core <span className="text-gradient-gold">Values</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {values.map(v => (
              <div key={v.title} className="glass card-hover" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>{v.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--cream)', marginBottom: '0.6rem' }}>{v.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--cream-dim)', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section gradient-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Our Journey</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}>
              Church <span className="text-gradient-gold">History</span>
            </h2>
          </div>
          <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '80px', top: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.4), transparent)' }} />
            {timeline.map((t) => (
              <div key={t.year} style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
                <div style={{ minWidth: '72px', textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)', paddingTop: '0.15rem' }}>{t.year}</div>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-1.5rem', top: '0.5rem', width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 8px rgba(212,175,55,0.6)' }} />
                  <div className="glass" style={{ padding: '1rem 1.5rem', borderRadius: '12px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--cream-dim)', lineHeight: 1.7, margin: 0 }}>{t.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

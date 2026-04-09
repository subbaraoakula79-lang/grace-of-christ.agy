import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import Link from 'next/link';

const ministries = [
  { icon: '🙏', title: 'Prayer Ministry', desc: 'Interceding for the city, nation, and world through daily corporate prayer.' },
  { icon: '🎵', title: 'Worship Ministry', desc: 'Leading hearts into the presence of God through music and praise.' },
  { icon: '👨‍👩‍👧‍👦', title: 'Family Ministry', desc: 'Strengthening marriages, parenting, and family bonds in biblical truth.' },
  { icon: '🌱', title: 'Youth Ministry', desc: 'Raising up the next generation for purpose, identity, and kingdom impact.' },
  { icon: '📖', title: "Women\u2019s Ministry", desc: 'Empowering women to walk in their God-given calling and community.' },
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
      <section className="section gradient-section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="section-label">Our Story</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '1.25rem' }}>
                A Church Built on <span className="text-gradient-gold">Grace & Faith</span>
              </h2>
              <span className="divider-gold" />
              <p style={{ color: 'var(--cream-dim)', lineHeight: 1.9, marginBottom: '1rem', fontSize: '0.95rem' }}>
                Grace of Christ Church stands as a beacon of hope in Yetimoga, Kakinada. Founded on the enduring Word of God, our congregation is a diverse family united by faith in Jesus Christ.
              </p>
              <p style={{ color: 'var(--cream-dim)', lineHeight: 1.9, marginBottom: '2rem', fontSize: '0.95rem' }}>
                Under the faithful leadership of <strong style={{ color: 'var(--cream)' }}>Pastor K. John Prasad</strong>, we believe in the transformative power of prayer, worship, and community service.
              </p>
              <Link href="/about" className="btn btn-outline-gold">Learn More About Us</Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {stats.map((s) => (
                <div key={s.label} className="glass-gold card-hover" style={{ padding: '1.75rem', textAlign: 'center', borderRadius: '16px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{s.number}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', letterSpacing: '0.06em', marginTop: '0.4rem', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Ministries Preview ────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--midnight)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>What We Do</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}>
              Our <span className="text-gradient-gold">Ministries</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {ministries.map((m) => (
              <div key={m.title} className="glass card-hover" style={{ padding: '2rem', borderRadius: '16px' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{m.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--cream)', marginBottom: '0.6rem' }}>{m.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--cream-dim)', lineHeight: 1.7 }}>{m.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/ministries" className="btn btn-outline-gold">View All Ministries</Link>
          </div>
        </div>
      </section>

      {/* ── Donate CTA ───────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--deep-navy), var(--purple-deep))' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
          <div className="section-label" style={{ justifyContent: 'center' }}>Support the Church</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Give to <span className="text-gradient-gold">God&apos;s Kingdom</span>
          </h2>
          <p style={{ color: 'var(--cream-dim)', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            Your generous offering helps us serve our community, support ministry programs, and declare the Good News across Andhra Pradesh.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/donate" className="btn btn-gold">Make a Donation</Link>
            <Link href="/contact" className="btn btn-glass">Contact Us</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

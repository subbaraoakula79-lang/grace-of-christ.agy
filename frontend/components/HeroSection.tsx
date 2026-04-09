'use client';
import { useState, useEffect } from 'react';

const phrases = ['Welcome to Grace of Christ', 'A Place of Worship', 'A Place of Hope', 'A Place of Love'];

export default function HeroSection() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const current = phrases[phraseIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timer = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      }, 55);
    } else if (!deleting && charIdx === current.length) {
      timer = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      }, 28);
    } else if (deleting && charIdx === 0) {
      timer = setTimeout(() => {
        setDeleting(false);
        setPhraseIdx(p => (p + 1) % phrases.length);
      }, 0);
    }
    return () => clearTimeout(timer);
  }, [charIdx, deleting, phraseIdx]);

  return (
    <section
      id="hero"
      className="gradient-hero"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: '72px' }}
    >
      {/* Background orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,63,160,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,30,61,0.6) 0%, transparent 60%)' }} />
        {/* Cross glow */}
        <div className="animate-pulse-glow" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-80%)', fontSize: '8rem', color: 'rgba(212,175,55,0.06)', fontWeight: 900, userSelect: 'none' }}>✝</div>
      </div>

      {/* Content */}
      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2, paddingBlock: '4rem' }}>
        {/* Label */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>Yetimoga · Kakinada · Andhra Pradesh</span>
          <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
        </div>

        {/* Typing headline */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', minHeight: '1.2em' }}>
          <span className="text-gradient-gold text-glow-gold">{displayed}</span>
          <span style={{ color: 'var(--gold)', opacity: 0.8, animation: 'pulse-glow 1s ease-in-out infinite' }}>|</span>
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--cream-dim)', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
          Led by <strong style={{ color: 'var(--cream)' }}>Pastor K. John Prasad</strong>, we are a community rooted in faith, filled with the Spirit, and called to make a difference.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/about" className="btn btn-gold">Discover Our Story</a>
          <a href="/donate" className="btn btn-outline-gold">Give an Offering</a>
          <a href="/sermons" className="btn btn-glass">Watch Sermons</a>
        </div>

        {/* Prayer Timings pill */}
        <div id="prayer-timings" className="glass-gold" style={{ display: 'inline-flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', padding: '1rem 2.5rem', borderRadius: 9999, marginTop: '3.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.2rem' }}>1st Prayer · 2nd Church</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--cream)' }}>6:00 AM – 9:30 AM</div>
          </div>
          <div style={{ width: 1, background: 'rgba(212,175,55,0.3)', alignSelf: 'stretch' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.2rem' }}>2nd Prayer · 1st Church</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--cream)' }}>9:30 AM – 12:30 PM</div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', opacity: 0.5 }}>
        <div style={{ width: 1, height: 48, background: 'linear-gradient(180deg, transparent, var(--gold))' }} />
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>Scroll</div>
      </div>
    </section>
  );
}

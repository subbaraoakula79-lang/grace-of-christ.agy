'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const phrases = [
  'Welcome to Grace of Christ',
  'A Place of Worship',
  'A Place of Hope',
  'A Place of Love',
];

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
        setCharIdx((c) => c + 1);
      }, 50);
    } else if (!deleting && charIdx === current.length) {
      timer = setTimeout(() => setDeleting(true), 2800);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, 35);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx((p) => (p + 1) % phrases.length);
    }
    return () => clearTimeout(timer);
  }, [charIdx, deleting, phraseIdx]);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '76px',
      }}
    >
      {/* ── Animated Orbs ─────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* Large emerald orb */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '10%', left: '5%',
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        {/* Lavender orb */}
        <motion.div
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 40, -20, 0],
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            position: 'absolute',
            bottom: '15%', right: '5%',
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        {/* Ice blue orb */}
        <motion.div
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -40, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          style={{
            position: 'absolute',
            top: '50%', left: '60%',
            width: 350, height: 350,
            background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)',
            filter: 'blur(45px)',
          }}
        />

        {/* Rotating ring */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -55%)',
          width: 300, height: 300,
          borderRadius: '50%',
          border: '1px solid rgba(16, 185, 129, 0.08)',
          animation: 'rotate-slow 60s linear infinite',
        }}>
          <div style={{
            position: 'absolute',
            top: -3, left: '50%',
            width: 6, height: 6,
            borderRadius: '50%',
            background: 'var(--violet)',
            opacity: 0.5,
            boxShadow: '0 0 12px var(--violet)',
          }} />
        </div>

        {/* Cross glow */}
        <div
          className="animate-pulse-soft"
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -65%)',
            fontSize: '10rem',
            color: 'rgba(16, 185, 129, 0.035)',
            fontWeight: 900,
            userSelect: 'none',
          }}
        >
          ✝
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div
        className="container"
        style={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          paddingBlock: '4rem',
        }}
      >
        {/* Location label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{
            width: 40, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.5))',
          }} />
          <span style={{
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--violet)',
            fontWeight: 600,
          }}>
            Yetimoga · Kakinada · Andhra Pradesh
          </span>
          <div style={{
            width: 40, height: 1,
            background: 'linear-gradient(90deg, rgba(16,185,129,0.5), transparent)',
          }} />
        </motion.div>

        {/* Typing headline */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
            fontWeight: 700,
            lineHeight: 1.08,
            marginBottom: '1.75rem',
            minHeight: '1.2em',
          }}
        >
          <span className="accent-text" style={{ filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.15))' }}>{displayed}</span>
          <span style={{
            color: 'var(--violet)',
            opacity: 0.7,
            animation: 'typing-cursor 1s ease-in-out infinite',
            marginLeft: '2px',
          }}>
            |
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto 3rem',
            lineHeight: 1.9,
          }}
        >
          Led by <strong style={{ color: 'var(--text-primary)' }}>Pastor K. John Prasad</strong>,
          we are a community rooted in faith, filled with the Spirit, and called to
          make a difference.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/about" className="btn-spatial btn-primary">
            Discover Our Story
          </Link>
          <Link href="/donate" className="btn-spatial btn-outline">
            Give an Offering
          </Link>
          <Link href="/sermons" className="btn-spatial btn-glass">
            Watch Sermons
          </Link>
        </motion.div>

        {/* Prayer Timings — Liquid Glass Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="spatial-glass-mid"
          style={{
            display: 'inline-flex',
            gap: '2.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '1.2rem 2.75rem',
            borderRadius: 'var(--r-pill)',
            marginTop: '4.5rem',
            border: '1px solid rgba(16, 185, 129, 0.15)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '0.6rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              marginBottom: '0.2rem',
            }}>
              1st Prayer · 2nd Church
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}>
              6:00 AM – 9:30 AM
            </div>
          </div>
          <div style={{
            width: 1,
            background: 'rgba(16, 185, 129, 0.2)',
            alignSelf: 'stretch',
          }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '0.6rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              marginBottom: '0.2rem',
            }}>
              2nd Prayer · 1st Church
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}>
              9:30 AM – 12:30 PM
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Cue */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: 0.4,
      }}>
        <div style={{
          width: 1, height: 50,
          background: 'linear-gradient(180deg, transparent, var(--violet))',
        }} />
        <div style={{
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--violet)',
        }}>
          Scroll
        </div>
      </div>
    </section>
  );
}

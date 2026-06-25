'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/ministries', label: 'Ministries' },
  { href: '/events', label: 'Events' },
  { href: '/sermons', label: 'Sermons' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <motion.nav
      id="main-nav"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        transition: 'background 0.5s ease, border-bottom 0.5s ease, box-shadow 0.5s ease',
        background: scrolled ? 'rgba(7, 13, 12, 0.75)' : 'rgba(7, 13, 12, 0.15)',
        backdropFilter: scrolled ? 'blur(50px) saturate(200%)' : 'blur(16px)',
        WebkitBackdropFilter: scrolled ? 'blur(50px) saturate(200%)' : 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(16, 185, 129, 0.1)' : '1px solid transparent',
        boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.02)' : 'none',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>

        {/* Logo */}
        <Link 
          href="/" 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none',
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{
              width: 44, height: 44, borderRadius: '50%', overflow: 'hidden',
              border: '1.5px solid rgba(16, 185, 129, 0.3)',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)',
            }}
          >
            <Image src="/logo.png" alt="GOC Logo" width={44} height={44} style={{ objectFit: 'cover', width: '100%', height: '100%' }} priority />
          </motion.div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.1 }}>
              <span className="accent-text">Grace of Christ</span>
            </div>
            <div style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Yetimoga · Kakinada
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.25rem' }} className="desktop-nav">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
          ))}
        </div>

        {/* CTA + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link 
            href="/donate" 
            className="btn-spatial btn-primary" 
            style={{ 
              padding: '0.55rem 1.5rem', fontSize: '0.76rem',
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            Give Now
          </Link>
          <button
            id="menu-toggle" aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger"
            style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '6px', zIndex: 1001 }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', width: '22px', height: '2px', borderRadius: '2px',
                background: menuOpen ? 'var(--violet)' : 'var(--text-primary)',
                transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
                opacity: i === 1 && menuOpen ? 0 : 1,
                transform: menuOpen
                  ? i === 0 ? 'translateY(7px) rotate(45deg)' : i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'none'
                  : 'none',
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile Menu — Floating dropdown glass card with framer-motion */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              top: '80px',
              right: '1rem',
              width: '260px',
              zIndex: 999,
              background: 'rgba(13, 22, 21, 0.95)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              borderRadius: '20px',
              padding: '1rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            {navLinks.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 + 0.05, duration: 0.3 }}
              >
                <Link href={l.href} onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize: '1rem', fontWeight: 600,
                    color: 'var(--text-primary)', textDecoration: 'none', padding: '0.65rem 1rem',
                    borderRadius: '12px', transition: 'all 0.2s',
                    display: 'block'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--violet)'; e.currentTarget.style.background = 'rgba(16, 185, 129, 0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: navLinks.length * 0.03 + 0.05, duration: 0.3 }}
              style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <Link href="/donate" className="btn-spatial btn-primary" onClick={() => setMenuOpen(false)} style={{ padding: '0.6rem', fontSize: '0.85rem', width: '100%', textAlign: 'center', display: 'block' }}>
                Give Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === 'light';

  // Passive scroll listener
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // ── Theme-aware colours ──────────────────────────────────────────
  const navBg = scrolled
    ? (isLight ? 'rgba(232, 248, 240, 0.95)' : 'rgba(7, 13, 12, 0.88)')
    : (isLight ? 'rgba(232, 248, 240, 0.25)' : 'rgba(7, 13, 12, 0.2)');

  const navShadow = scrolled
    ? (isLight ? '0 4px 30px rgba(0,0,0,0.08)' : '0 4px 30px rgba(0,0,0,0.28)')
    : 'none';

  // Logo ring — golden sun glow in light mode, emerald in dark mode
  const logoBorder = isLight
    ? '2px solid rgba(251, 191, 36, 0.65)'
    : '1.5px solid rgba(16, 185, 129, 0.35)';

  const logoShadow = isLight
    ? '0 0 18px rgba(251, 191, 36, 0.4), 0 0 42px rgba(251, 191, 36, 0.15)'
    : '0 0 18px rgba(16, 185, 129, 0.15)';

  // Mobile dropdown
  const menuBg = isLight ? 'rgba(230, 247, 238, 0.97)' : 'rgba(10, 18, 17, 0.97)';
  const menuBorder = isLight ? '1px solid rgba(16, 185, 129, 0.22)' : '1px solid rgba(16, 185, 129, 0.18)';
  const menuShadow = isLight
    ? '0 20px 50px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.85)'
    : '0 20px 50px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)';
  const menuDivider = isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.06)';

  return (
    <motion.nav
      id="main-nav"
      role="navigation"
      aria-label="Main navigation"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        background: navBg,
        backdropFilter: scrolled ? 'blur(40px) saturate(180%)' : 'blur(14px)',
        WebkitBackdropFilter: scrolled ? 'blur(40px) saturate(180%)' : 'blur(14px)',
        borderBottom: scrolled ? '1px solid rgba(16, 185, 129, 0.12)' : '1px solid transparent',
        boxShadow: navShadow,
        transition: 'background 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

        {/* ── Logo (theme toggle) + Church name (home link) ──────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>

          {/* Logo = Theme Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            aria-label={isLight ? 'Switch to dark mode 🌙' : 'Switch to light mode ☀️'}
            title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            whileHover={{ scale: 1.08, rotate: isLight ? -15 : 15 }}
            whileTap={{ scale: 0.90 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            style={{
              width: 48, height: 48,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              border: logoBorder,
              boxShadow: logoShadow,
              background: '#ffffff',
              cursor: 'pointer',
              padding: 0,
              outline: 'none',
              position: 'relative',
              transition: 'border 0.45s ease, box-shadow 0.45s ease',
            }}
          >
            <Image
              src="/logo.png"
              alt="Grace of Christ Church logo"
              width={48}
              height={48}
              priority
              style={{ objectFit: 'contain', width: '100%', height: '100%', display: 'block' }}
            />
            {/* Tiny mode indicator badge */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: 1, right: 1,
                width: 14, height: 14,
                borderRadius: '50%',
                background: isLight ? '#FCD34D' : '#1e3a34',
                border: isLight ? '1.5px solid #fff' : '1.5px solid rgba(16,185,129,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '7px',
                lineHeight: 1,
                transition: 'background 0.4s ease',
              }}
            >
              {isLight ? '☀' : '🌙'}
            </span>
          </motion.button>

          {/* Church name — navigates home */}
          <Link
            href="/"
            aria-label="Grace of Christ Church — Home"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#10B981',
              transition: 'color 0.3s ease',
            }}>
              Grace of Christ
            </div>
            <div style={{
              fontSize: '0.58rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              transition: 'color 0.3s ease',
            }}>
              Yetimoga · Kakinada
            </div>
          </Link>
        </div>

        {/* ── Desktop Nav ────────────────────────────────────────── */}
        <nav aria-label="Desktop navigation" className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
          ))}
        </nav>

        {/* ── Give Now CTA + Hamburger ────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            href="/donate"
            className="btn-spatial btn-primary"
            style={{ padding: '0.5rem 1.35rem', fontSize: '0.76rem' }}
          >
            Give Now
          </Link>

          <button
            id="menu-toggle"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger"
            style={{
              display: 'none', flexDirection: 'column', justifyContent: 'center',
              gap: '5px', background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px', borderRadius: '8px', zIndex: 1001,
              minWidth: '36px', minHeight: '36px',
            }}
          >
            {[0, 1, 2].map(i => (
              <span
                key={i}
                aria-hidden="true"
                style={{
                  display: 'block', width: '22px', height: '2px', borderRadius: '2px',
                  background: menuOpen ? 'var(--violet)' : 'var(--text-primary)',
                  transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
                  opacity: i === 1 && menuOpen ? 0 : 1,
                  transform: menuOpen
                    ? i === 0 ? 'translateY(7px) rotate(45deg)'
                    : i === 2 ? 'translateY(-7px) rotate(-45deg)'
                    : 'none'
                    : 'none',
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ───────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              top: '76px',
              right: '1rem',
              width: 'min(260px, calc(100vw - 2rem))',
              zIndex: 999,
              background: menuBg,
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: menuBorder,
              borderRadius: '18px',
              padding: '0.85rem',
              boxShadow: menuShadow,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            {navLinks.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 + 0.04, duration: 0.25 }}
              >
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize: '0.95rem', fontWeight: 600,
                    color: 'var(--text-primary)', textDecoration: 'none',
                    padding: '0.6rem 0.9rem',
                    borderRadius: '10px', transition: 'all 0.18s',
                    display: 'block',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--violet)';
                    e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: navLinks.length * 0.03 + 0.04, duration: 0.25 }}
              style={{ marginTop: '0.4rem', paddingTop: '0.65rem', borderTop: menuDivider }}
            >
              <Link
                href="/donate"
                className="btn-spatial btn-primary"
                onClick={() => setMenuOpen(false)}
                style={{ padding: '0.6rem', fontSize: '0.82rem', width: '100%', textAlign: 'center', display: 'block' }}
              >
                Give Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

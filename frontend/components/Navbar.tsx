'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

  return (
    <nav
      id="main-nav"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        transition: 'all 0.4s ease',
        background: scrolled ? 'rgba(7,11,20,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(212,175,55,0.1)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <Image
            src="/logo.png"
            alt="Grace of Christ Church Logo"
            width={46}
            height={46}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
            priority
          />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.02em', lineHeight: 1.1 }}>
              Grace of Christ
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--cream-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Yetimoga, Kakinada
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
          ))}
        </div>

        {/* CTA + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/donate" className="btn btn-gold" style={{ padding: '0.55rem 1.4rem', fontSize: '0.8rem' }}>
            Give Now
          </Link>
          <button
            id="menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger"
            style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--cream)', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--cream)', borderRadius: '2px', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--cream)', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(7,11,20,0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(212,175,55,0.1)',
          padding: '1.5rem',
        }}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link"
              onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {l.label}
            </Link>
          ))}
          <Link href="/donate" className="btn btn-gold" onClick={() => setMenuOpen(false)} style={{ display: 'inline-flex', marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
            Give Now
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

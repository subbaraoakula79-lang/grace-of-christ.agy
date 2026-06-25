'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const footerLinks = {
  Pages: [
    { href: '/about', label: 'About Us' },
    { href: '/ministries', label: 'Ministries' },
    { href: '/events', label: 'Events' },
    { href: '/sermons', label: 'Sermons' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ],
  Worship: [
    { href: '/#prayer-timings', label: '1st Prayer: 6:00–9:30 AM' },
    { href: '/#prayer-timings', label: '2nd Prayer: 9:30 AM–12:30 PM' },
  ],
  Connect: [
    { href: '/donate', label: 'Donate' },
    { href: '/contact', label: 'Prayer Request' },
    { href: '/admin/login', label: 'Admin Login' },
  ],
};

function FooterLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      style={{ fontSize: '0.88rem', color: hovered ? 'var(--violet)' : 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: 'var(--space-mid)', borderTop: '1px solid rgba(16, 185, 129, 0.12)' }}>
      <div className="container" style={{ paddingBlock: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>

          {/* Church Info */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '1.25rem' }}>
              <Image
                src="/logo.png"
                alt="Grace of Christ Church"
                width={52}
                height={52}
                style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1.5px solid rgba(16, 185, 129, 0.25)' }}
              />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--violet)' }}>Grace of Christ</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>GOC Church · Kakinada</div>
              </div>
            </Link>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '220px' }}>
              A spirit-filled community of believers in Yetimoga, Kakinada, Andhra Pradesh.
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>📍 Yetimoga, Kakinada, AP</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>👤 Pastor K. John Prasad</span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--violet)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {links.map((l, i) => (
                  <li key={`${title}-${i}`}>
                    <FooterLink href={l.href} label={l.label} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', padding: '1.25rem 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>
          © {new Date().getFullYear()} Grace of Christ (GOC) Church · Yetimoga, Kakinada, Andhra Pradesh, India · All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

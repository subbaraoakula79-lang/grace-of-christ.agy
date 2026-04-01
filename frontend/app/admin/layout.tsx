'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/donations', label: 'Donations', icon: '💰' },
  { href: '/admin/events', label: 'Events', icon: '📅' },
  { href: '/admin/sermons', label: 'Sermons', icon: '🎙' },
  { href: '/admin/gallery', label: 'Gallery', icon: '🖼' },
  { href: '/admin/messages', label: 'Messages', icon: '✉️' },
  { href: '/admin/reports', label: 'Reports', icon: '📈' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    const token = localStorage.getItem('goc_access_token');
    const u = localStorage.getItem('goc_user');
    if (!token || !u) { router.push('/admin/login'); return; }
    setUser(JSON.parse(u));
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = async () => {
    const token = localStorage.getItem('goc_access_token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` }, credentials: 'include',
    }).catch(() => {});
    localStorage.removeItem('goc_access_token');
    localStorage.removeItem('goc_user');
    router.push('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--midnight)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', flexShrink: 0,
        background: 'var(--deep-navy)',
        borderRight: '1px solid rgba(212,175,55,0.1)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s',
      }} className="admin-sidebar">
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)' }}>✝ GOC Admin</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--cream-dim)', marginTop: '0.2rem' }}>Grace of Christ Church</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.85rem',
                  padding: '0.8rem 1.5rem',
                  color: active ? 'var(--gold)' : 'var(--cream-dim)',
                  background: active ? 'rgba(212,175,55,0.08)' : 'transparent',
                  borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent',
                  textDecoration: 'none', fontSize: '0.88rem', fontWeight: active ? 600 : 400,
                  transition: 'all 0.2s',
                }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & logout */}
        {user && (
          <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--cream)', fontWeight: 600, marginBottom: '0.2rem' }}>{user.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--cream-dim)', marginBottom: '1rem' }}>{user.role}</div>
            <button id="admin-logout" onClick={handleLogout} className="btn btn-glass" style={{ width: '100%', padding: '0.5rem', fontSize: '0.78rem' }}>Sign Out</button>
          </div>
        )}
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '240px' }} className="admin-main">
        {/* Top bar */}
        <header style={{ height: '60px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1rem', background: 'rgba(12,22,40,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 40 }}>
          <button id="sidebar-toggle" aria-label="Toggle sidebar" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'var(--cream)', cursor: 'pointer', fontSize: '1.2rem' }} className="hamburger">☰</button>
          <div style={{ flex: 1 }} />
          <Link href="/" target="_blank" style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', textDecoration: 'none' }}>View Site ↗</Link>
        </header>

        <main style={{ flex: 1, padding: '2rem' }}>
          {children}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 49 }} />}

      <style>{`
        @media (min-width: 769px) {
          .admin-sidebar { transform: translateX(0) !important; }
          .hamburger { display: none !important; }
        }
        @media (max-width: 768px) {
          .admin-main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}

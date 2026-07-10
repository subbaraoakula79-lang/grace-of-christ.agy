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
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 'checking' = auth not yet verified, 'ok' = authenticated, 'denied' = redirect pending
  const [authState, setAuthState] = useState<'checking' | 'ok' | 'denied'>('checking');

  useEffect(() => {
    // Login page never needs an auth check
    if (pathname === '/admin/login') {
      setAuthState('ok');
      return;
    }

    const token = localStorage.getItem('goc_access_token');
    const u = localStorage.getItem('goc_user');

    if (!token || !u) {
      setAuthState('denied');
      router.replace('/admin/login');
      return;
    }

    try {
      const parsed = JSON.parse(u) as { name: string; role: string };
      // Basic sanity: must have name + role
      if (!parsed.name || !parsed.role) throw new Error('Invalid user data');
      setUser(parsed);
      setAuthState('ok');
    } catch {
      // Corrupt / tampered local storage — force re-login
      localStorage.removeItem('goc_access_token');
      localStorage.removeItem('goc_user');
      setAuthState('denied');
      router.replace('/admin/login');
    }
  }, [pathname, router]);

  // ── Login page — render as-is (no sidebar, no auth gate) ─────────────────────
  if (pathname === '/admin/login') return <>{children}</>;

  // ── Auth still being verified — render nothing to prevent content flash ───────
  // This is the key fix: previously children rendered for one frame before the
  // redirect fired, allowing a brief unauthenticated view of protected content.
  if (authState === 'checking' || authState === 'denied') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--space)', color: 'var(--text-secondary)', fontSize: '0.9rem'
      }}>
        Verifying session…
      </div>
    );
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('goc_access_token');
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await fetch(`${API}/auth/logout`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, credentials: 'include',
      });
    } catch (err) {
      console.warn('Logging out offline mode', err);
    }
    localStorage.removeItem('goc_access_token');
    localStorage.removeItem('goc_user');
    router.replace('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--space)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', flexShrink: 0,
        background: 'var(--space-mid)',
        borderRight: '1px solid rgba(16, 185, 129, 0.12)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      }} className="admin-sidebar">
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(16, 185, 129, 0.12)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--violet)' }}>✝ GOC Admin</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Grace of Christ</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1.25rem 0', overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.85rem',
                  padding: '0.85rem 1.5rem',
                  color: active ? 'var(--violet)' : 'var(--text-secondary)',
                  background: active ? 'rgba(16, 185, 129, 0.06)' : 'transparent',
                  borderLeft: active ? '3px solid var(--violet)' : '3px solid transparent',
                  textDecoration: 'none', fontSize: '0.9rem', fontWeight: active ? 600 : 400,
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
          <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(16, 185, 129, 0.12)', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.2rem' }}>{user.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{user.role}</div>
            <button id="admin-logout" onClick={handleLogout} className="btn-spatial btn-glass" style={{ width: '100%', padding: '0.5rem', fontSize: '0.78rem' }}>Sign Out</button>
          </div>
        )}
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '240px' }} className="admin-main">
        {/* Top bar */}
        <header style={{ 
          height: '60px', 
          borderBottom: '1px solid rgba(16, 185, 129, 0.12)', 
          display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1rem', 
          background: 'rgba(7,13,12,0.8)', backdropFilter: 'blur(20px)', 
          position: 'sticky', top: 0, zIndex: 40 
        }}>
          <button id="sidebar-toggle" aria-label="Toggle sidebar" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.4rem' }} className="hamburger">☰</button>
          <div style={{ flex: 1 }} />
          <Link href="/" target="_blank" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--violet)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>View Site ↗</Link>
        </header>

        <main style={{ flex: 1, padding: '2rem' }}>
          {children}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 49 }} />}

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

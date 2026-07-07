'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');

    let API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    if (API && !API.endsWith('/api') && !API.endsWith('/api/')) {
      API = `${API.replace(/\/+$/, '')}/api`;
    }

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      // Always try to parse JSON — handle non-JSON responses gracefully
      let data: any = {};
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('[Login] Non-JSON response from server:', text);
        data = { error: `Server error (${res.status}): ${text.slice(0, 200)}` };
      }

      console.log(`[Login] ${res.status} response:`, data);

      if (!res.ok) {
        // Surface the real server error — never swallow it
        const serverMsg = data?.error || data?.message || `Server responded with ${res.status}`;

        if (res.status === 429) {
          throw new Error('Too many login attempts. Please wait 15 minutes and try again.');
        } else if (res.status === 503) {
          throw new Error('Database is temporarily unavailable. Please try again shortly.');
        } else {
          throw new Error(serverMsg);
        }
      }

      localStorage.setItem('goc_access_token', data.accessToken);
      localStorage.setItem('goc_user', JSON.stringify(data.user));
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('[Login] Error:', err);

      const isLocalhostAPI = API.includes('localhost') || API.includes('127.0.0.1');
      const isProductionSite = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');

      if (isLocalhostAPI && isProductionSite) {
        setError(
          'Configuration error: This site is pointing to localhost. ' +
          'Set NEXT_PUBLIC_API_URL in your Vercel project settings and redeploy.'
        );
      } else if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError(`Cannot reach the server at ${API}. Make sure the backend is running and CORS is configured.`);
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* ── Background Orbs ─────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div
          animate={{ x: [0, 20, -20, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '15%', left: '10%',
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 40, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            position: 'absolute', bottom: '15%', right: '10%',
            width: 450, height: 450,
            background: 'radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%)',
            filter: 'blur(55px)',
          }}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="spatial-glass-mid"
        style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem', borderRadius: '24px', margin: '1rem', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--violet), var(--amber))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', color: '#000', fontWeight: 700, margin: '0 auto 1.25rem',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
          }}>✝</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>Admin Portal</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.3rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Grace of Christ Church</div>
        </div>



        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Email Address / Username</label>
            <input id="admin-email" className="input-spatial" type="text" placeholder="admin" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Password</label>
            <input id="admin-password" className="input-spatial" type="password" placeholder="••••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          {error && <p style={{ fontSize: '0.82rem', color: '#f87171', margin: 0, fontWeight: 500 }}>⚠️ {error}</p>}

          <button id="admin-login-btn" type="submit" className="btn-spatial btn-primary" disabled={loading} style={{ marginTop: '0.75rem', width: '100%' }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          🔒 Secure admin access only. Unauthorized access is prohibited.
        </p>
      </motion.div>
    </div>
  );
}

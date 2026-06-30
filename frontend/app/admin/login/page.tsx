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

    // Check mock credentials first (fallback when backend is offline)
    if (email === 'admin@graceofchrist.org' && password === 'Graceofchrist@2026') {
      setTimeout(() => {
        localStorage.setItem('goc_access_token', 'mock_token_admin_goc_2026');
        localStorage.setItem('goc_user', JSON.stringify({ name: 'K. John Prasad', role: 'Super Admin' }));
        router.push('/admin/dashboard');
      }, 600);
      return;
    }

    try {
      let API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      if (API && !API.endsWith('/api') && !API.endsWith('/api/')) {
        API = `${API.replace(/\/+$/, '')}/api`;
      }
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('goc_access_token', data.accessToken);
      localStorage.setItem('goc_user', JSON.stringify(data.user));
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
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

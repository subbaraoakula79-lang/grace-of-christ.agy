'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [requiresTOTP, setRequiresTOTP] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, ...(requiresTOTP && { totpToken }) }),
      });
      const data = await res.json();

      if (res.status === 200 && data.requiresTOTP) {
        setRequiresTOTP(true); setLoading(false); return;
      }
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('goc_access_token', data.accessToken);
      localStorage.setItem('goc_user', JSON.stringify(data.user));
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--midnight)' }} className="gradient-hero">

      {/* Card */}
      <div className="glass" style={{ width: '100%', maxWidth: '420px', padding: '3rem', borderRadius: '24px', margin: '1rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #B8973A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', color: '#070B14', fontWeight: 700, margin: '0 auto 1rem' }}>✝</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold)' }}>Admin Portal</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', marginTop: '0.25rem' }}>Grace of Christ Church</div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!requiresTOTP ? (
            <>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
                <input id="admin-email" className="input-field" type="email" placeholder="admin@graceofchrist.org" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Password</label>
                <input id="admin-password" className="input-field" type="password" placeholder="••••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </>
          ) : (
            <div>
              <div style={{ padding: '1rem 1.25rem', borderRadius: '10px', background: 'rgba(107,63,160,0.1)', border: '1px solid rgba(107,63,160,0.3)', color: '#C4B5FD', fontSize: '0.85rem', marginBottom: '0.5rem', lineHeight: 1.6 }}>
                🔐 <strong>2FA Required</strong> — Enter the 6-digit code from your Google Authenticator app.
              </div>
              <label style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Authenticator Code</label>
              <input id="totp-token" className="input-field" type="text" inputMode="numeric" placeholder="000000" maxLength={6} pattern="[0-9]{6}" required value={totpToken} onChange={e => setTotpToken(e.target.value)} style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.4em' }} />
            </div>
          )}

          {error && <p style={{ fontSize: '0.82rem', color: '#f87171', margin: 0 }}>⚠ {error}</p>}

          <button id="admin-login-btn" type="submit" className="btn btn-gold" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : requiresTOTP ? 'Verify & Sign In' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--cream-dim)' }}>
          🔒 Secure admin access only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}

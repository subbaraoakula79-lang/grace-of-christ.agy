'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '../../../lib/api';

export default function AdminSettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Load current user profile from local storage
    const u = localStorage.getItem('goc_user');
    if (u) {
      try {
        const parsed = JSON.parse(u);
        setName(parsed.name || '');
        setEmail(parsed.email || '');
      } catch (err) {
        console.error('Failed to parse user profile', err);
      }
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');

    // Validations
    if (newPassword) {
      if (!currentPassword) {
        setError('⚠️ Current password is required to change password.');
        return;
      }
      if (newPassword.length < 8) {
        setError('⚠️ New password must be at least 8 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('⚠️ New password and confirmation do not match.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload: Record<string, string> = { name, email };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await authAPI.updateProfile(payload);
      const { user } = res.data;

      // Update user state in local storage
      localStorage.setItem('goc_user', JSON.stringify(user));
      setMessage('✅ Profile updated successfully!');
      
      // Clear passwords
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.response?.data?.error || err?.response?.data?.detail || err?.message || 'Update failed.';
      setError(`❌ Update failed: ${errMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Admin Settings ⚙️
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
          Update your administrative login credentials, email address, and name.
        </p>
      </div>

      {/* Main card */}
      <div className="spatial-card" style={{ padding: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* General Fields */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--violet)', borderBottom: '1px solid rgba(16, 185, 129, 0.12)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
              General Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
                  Display Name
                </label>
                <input
                  type="text"
                  className="input-spatial"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pastor K. John Prasad"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
                  Email Address / Username
                </label>
                <input
                  type="email"
                  className="input-spatial"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@graceofchrist.org"
                />
              </div>
            </div>
          </div>

          {/* Password Reset Fields */}
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--violet)', borderBottom: '1px solid rgba(16, 185, 129, 0.12)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
              Change Password (Optional)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
                  Current Password
                </label>
                <input
                  type="password"
                  className="input-spatial"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    className="input-spatial"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="input-spatial"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Min 8 characters"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div style={{ fontSize: '0.88rem', color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{ fontSize: '0.88rem', color: '#f87171', background: 'rgba(248, 113, 113, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-spatial btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem', marginTop: '1rem' }}
          >
            {submitting ? 'Saving Changes...' : 'Save Profile Changes 💾'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

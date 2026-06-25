'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function DonatePage() {
  const [form, setForm] = useState({ donorName: '', email: '', amount: '501', notes: '' });
  const [showQR, setShowQR] = useState(false);
  const [donationDone, setDonationDone] = useState(false);
  const [customQR, setCustomQR] = useState<string | null>(null);

  useEffect(() => {
    // Load QR code set by admin from localStorage
    const savedQR = localStorage.getItem('goc_donation_qr');
    if (savedQR) {
      setCustomQR(savedQR);
    }
  }, []);

  const handleShowQR = (e: React.FormEvent) => {
    e.preventDefault();
    setShowQR(true);
    setDonationDone(false);

    // Save a mock donation log so it appears in the admin dashboard
    const receiptId = `GOC-${Date.now().toString().slice(-6)}-QR`;
    const newDonation = {
      id: `don-${Date.now()}`,
      receiptId,
      donorName: form.donorName || 'Anonymous Giver',
      email: form.email || 'anonymous@graceofchrist.org',
      phone: 'N/A',
      amount: form.amount || '0',
      paymentMethod: 'UPI (QR Code)',
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
      notes: form.notes || 'UPI QR Scan Offering'
    };

    try {
      const stored = localStorage.getItem('goc_donations');
      const donations = stored ? JSON.parse(stored) : [];
      donations.unshift(newDonation);
      localStorage.setItem('goc_donations', JSON.stringify(donations));
    } catch (err) {
      console.warn('Failed to log donation intent locally', err);
    }
  };

  const handleDone = () => {
    setShowQR(false);
    setDonationDone(false);
    setForm({ donorName: '', email: '', amount: '501', notes: '' });
  };

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="page-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-label">Support GOC</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem' }}>
              Make a <span className="accent-text">Donation</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.8 }}>
              Scan the church QR code using any UPI app (Google Pay, PhonePe, Paytm, BHIM) to make your offering.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--space-mid)', minHeight: '60vh', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '10%', right: '-15%',
          width: '450px', height: '450px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05), transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none'
        }} />

        <div className="container" style={{ maxWidth: '540px', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="spatial-glass-mid"
            style={{ padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Offering Details</h2>
            
            <form onSubmit={handleShowQR} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Your Name (Optional)</label>
                <input id="donor-name" className="input-spatial" type="text" placeholder="Anonymous" value={form.donorName} onChange={e => setForm(f => ({ ...f, donorName: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Email Address (Optional)</label>
                <input id="donor-email" className="input-spatial" type="email" placeholder="email@address.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Amount (₹) (Optional)</label>
                <input id="donor-amount" className="input-spatial" type="number" min="1" placeholder="e.g. 500" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Purpose / Prayer Request (Optional)</label>
                <textarea id="donor-notes" className="input-spatial" rows={3} placeholder="Notes or prayer requests..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: 'none' }} />
              </div>

              <button id="show-qr-btn" type="submit" className="btn-spatial btn-primary" style={{ marginTop: '0.75rem', width: '100%' }}>
                Show UPI QR Code 📱
              </button>
            </form>
          </motion.div>

          {/* Trust badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '2.5rem' }}>
            {['🔒 Secure UPI', '✝ Kingdom Offering', '⛪ Yetimoga, Kakinada'].map(b => (
              <span key={b} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* QR Code Modal Overlay */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1100,
              background: 'rgba(7, 13, 12, 0.94)',
              backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1.5rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="spatial-glass-top"
              style={{
                width: '100%', maxWidth: '400px',
                padding: '2.5rem 2rem', border: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'center'
              }}
            >
              {!donationDone ? (
                <>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>UPI QR Code</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Scan and pay using GPay, PhonePe, or BHIM</p>
                  
                  {/* QR Image Container */}
                  <div style={{
                    background: '#fff', padding: '1.25rem', borderRadius: '18px',
                    width: '240px', height: '240px', margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={customQR || '/donation_qr.png'} 
                      alt="Donation QR Code" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                  </div>

                  {form.amount && (
                    <div className="spatial-glass" style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', display: 'inline-block', border: '1px solid rgba(16, 185, 129, 0.25)', color: 'var(--violet)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
                      ₹{parseFloat(form.amount).toLocaleString('en-IN')}
                    </div>
                  )}

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem', padding: '0 0.5rem' }}>
                    Once you complete the scan and transfer, tap the confirmation button below.
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn-spatial btn-glass" onClick={() => setShowQR(false)} style={{ flex: 1 }}>Cancel</button>
                    <button className="btn-spatial btn-primary" onClick={() => setDonationDone(true)} style={{ flex: 2 }}>I Have Scanned ✅</button>
                  </div>
                </>
              ) : (
                <div style={{ padding: '1rem 0' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🙏</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--violet)', marginBottom: '0.75rem' }}>Thank You!</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
                    We appreciate your donation support for the ministry of Grace of Christ Church. God bless you!
                  </p>
                  <button className="btn-spatial btn-primary" onClick={handleDone} style={{ width: '100%' }}>
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface ReceiptData {
  receiptId: string;
  donorName: string;
  email: string;
  phone: string;
  amount: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export default function ReceiptPage() {
  const params = useParams();
  const receiptId = params.receiptId as string;
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        // Try local storage first
        const stored = localStorage.getItem('goc_donations');
        if (stored) {
          const donations: ReceiptData[] = JSON.parse(stored);
          const found = donations.find(d => d.receiptId === receiptId);
          if (found) {
            setReceipt(found);
            setLoading(false);
            return;
          }
        }

        // Try API next
        const res = await fetch(`${API}/donations/receipt/${receiptId}`);
        if (res.ok) {
          const data = await res.json();
          setReceipt(data);
        }
      } catch (err) {
        console.error('Failed to load receipt', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [API, receiptId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="page-header" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading receipt details...</div>
        </section>
        <Footer />
      </>
    );
  }

  if (!receipt) {
    return (
      <>
        <Navbar />
        <section className="page-header" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>❌</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Receipt Not Found</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>The receipt ID <strong style={{ color: 'var(--text-primary)' }}>{receiptId}</strong> could not be found.</p>
            <Link href="/donate" className="btn-spatial btn-primary">Make a Donation</Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const amount = parseFloat(receipt.amount);
  const date = new Date(receipt.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <>
      <Navbar />

      <section className="page-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🙏</div>
            <div className="section-label">Donation Confirmed</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
              Thank You, <span className="accent-text">{receipt.donorName.split(' ')[0]}!</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              God bless you for your generous gift to Grace of Christ Church.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--space-mid)', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '10%', right: '-10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05), transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none'
        }} />

        <div className="container" style={{ maxWidth: '600px', position: 'relative', zIndex: 1 }}>
          {/* Receipt Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="spatial-glass-mid"
            style={{ overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            {/* Header */}
            <div style={{ padding: '2.5rem 2rem 2rem', textAlign: 'center', borderBottom: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--violet)', marginBottom: '0.25rem' }}>GRACE OF CHRIST</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Yetimoga, Kakinada, Andhra Pradesh · Pastor K. John Prasad</div>
            </div>

            {/* Receipt ID Banner */}
            <div style={{ background: 'linear-gradient(135deg, var(--violet), var(--amber))', padding: '0.85rem', textAlign: 'center' }}>
              <span style={{ fontWeight: 700, color: '#000', letterSpacing: '0.1em', fontSize: '0.95rem' }}>RECEIPT ID: {receipt.receiptId}</span>
            </div>

            {/* Amount */}
            <div style={{ padding: '2.5rem 2rem', textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Donation Amount</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 1rem', borderRadius: 9999, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34D399', fontSize: '0.8rem', fontWeight: 600 }}>
                ✅ {receipt.status}
              </div>
            </div>

            {/* Donor Details */}
            <div style={{ padding: '2rem' }}>
              {[
                { label: 'Donor Name', value: receipt.donorName },
                { label: 'Email', value: receipt.email },
                { label: 'Phone', value: receipt.phone },
                { label: 'Payment Method', value: receipt.paymentMethod.toUpperCase() },
                { label: 'Date & Time', value: date },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', maxWidth: '58%' }}>{r.value}</span>
                </div>
              ))}
            </div>

            {/* Thank You */}
            <div style={{ background: 'rgba(16, 185, 129, 0.03)', padding: '1.5rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(16, 185, 129, 0.1)' }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                Your receipt has been stored in your profile logs. Thank you for supporting <strong style={{ color: 'var(--violet)' }}>Grace of Christ Church</strong> and the Kingdom of God!
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/" className="btn-spatial btn-primary">Return to Home</Link>
            <Link href="/donate" className="btn-spatial btn-glass">Give Again</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

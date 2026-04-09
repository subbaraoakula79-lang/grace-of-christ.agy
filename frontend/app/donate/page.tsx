'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'wallet', label: 'Wallet', icon: '👛' },
  { id: 'cash', label: 'Cash / Hand', icon: '💵' },
];

const presetAmounts = [101, 501, 1001, 2001, 5001, 11001];

type Step = 1 | 2 | 3;

export default function DonatePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    donorName: '', email: '', phone: '',
    amount: 501, customAmount: '',
    paymentMethod: 'upi',
    notes: '',
  });

  const setField = (k: keyof typeof form, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const finalAmount = form.customAmount ? parseFloat(form.customAmount) : form.amount;

  // Step 1 → 2 validation
  const goToStep2 = () => {
    if (!form.donorName.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Please fill all required fields.'); return;
    }
    setError(''); setStep(2);
  };

  // Submit donation (mock payment)
  const handleDonate = async () => {
    if (!finalAmount || finalAmount < 1) { setError('Please enter a valid amount.'); return; }
    setLoading(true); setError('');
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      // Create mock order
      const orderRes = await fetch(`${API}/donations/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount }),
      });
      if (!orderRes.ok) throw new Error('Order creation failed');

      // Submit donation with mockConfirm: true (dev mode)
      const donateRes = await fetch(`${API}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: form.donorName,
          email: form.email,
          phone: form.phone,
          amount: finalAmount,
          paymentMethod: form.paymentMethod,
          notes: form.notes,
          mockConfirm: true,
        }),
      });

      const data = await donateRes.json();
      if (!donateRes.ok) throw new Error(data.error || 'Donation failed');

      router.push(`/donate/receipt/${data.receiptId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="gradient-hero" style={{ paddingTop: '140px', paddingBottom: '4rem', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label" style={{ justifyContent: 'center' }}>Support GOC</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Make a <span className="text-gradient-gold">Donation</span>
          </h1>
          <p style={{ color: 'var(--cream-dim)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.8 }}>
            Every gift, large or small, advances the Kingdom of God and supports ministry in Kakinada.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--midnight)' }}>
        <div className="container" style={{ maxWidth: '700px' }}>

          {/* Step Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem', gap: '0' }}>
            {(['Your Details', 'Amount & Payment', 'Confirm'][0]).split('').length > 0 && [1, 2, 3].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step >= s ? 'linear-gradient(135deg, var(--gold), var(--gold-light))' : 'rgba(255,255,255,0.05)',
                  color: step >= s ? '#070B14' : 'var(--cream-dim)',
                  fontWeight: 700, fontSize: '0.9rem',
                  border: step === s ? '2px solid var(--gold)' : 'none',
                  flexShrink: 0, zIndex: 1,
                  boxShadow: step === s ? '0 0 16px rgba(212,175,55,0.4)' : 'none',
                  transition: 'all 0.3s',
                }}>{s}</div>
                <div style={{ fontSize: '0.75rem', color: step >= s ? 'var(--gold)' : 'var(--cream-dim)', marginLeft: '0.5rem', whiteSpace: 'nowrap', display: 'none' }}>
                  {['Your Details', 'Amount', 'Confirm'][i]}
                </div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: step > s ? 'var(--gold)' : 'rgba(255,255,255,0.08)', margin: '0 0.75rem' }} />}
              </div>
            ))}
          </div>

          <div className="glass" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', borderRadius: '24px' }}>

            {/* ── Step 1: Personal Info ─────────────────────────────────────── */}
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.75rem' }}>Your Details</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Full Name *</label>
                    <input id="donor-name" className="input-field" type="text" placeholder="Enter your full name" value={form.donorName} onChange={e => setField('donorName', e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Email Address *</label>
                    <input id="donor-email" className="input-field" type="email" placeholder="your@email.com" value={form.email} onChange={e => setField('email', e.target.value)} required />
                    <p style={{ fontSize: '0.75rem', color: 'var(--cream-dim)', marginTop: '0.3rem', opacity: 0.7 }}>Receipt will be sent to this email.</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Phone Number *</label>
                    <input id="donor-phone" className="input-field" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={e => setField('phone', e.target.value)} required />
                  </div>
                </div>
                {error && <p style={{ fontSize: '0.85rem', color: '#f87171', marginTop: '1rem' }}>{error}</p>}
                <button id="next-step-1" className="btn btn-gold" onClick={goToStep2} style={{ marginTop: '2rem', width: '100%' }}>
                  Continue to Amount →
                </button>
              </div>
            )}

            {/* ── Step 2: Amount & Payment ──────────────────────────────────── */}
            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.75rem' }}>Amount &amp; Payment</h2>

                {/* Preset amounts */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.8rem' }}>Select Amount (₹)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {presetAmounts.map(amt => (
                      <button key={amt} id={`amount-${amt}`}
                        onClick={() => { setField('amount', amt); setField('customAmount', ''); }}
                        style={{
                          padding: '0.85rem', borderRadius: '12px', border: '1.5px solid',
                          borderColor: form.amount === amt && !form.customAmount ? 'var(--gold)' : 'rgba(255,255,255,0.08)',
                          background: form.amount === amt && !form.customAmount ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                          color: form.amount === amt && !form.customAmount ? 'var(--gold)' : 'var(--cream)',
                          cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
                          fontFamily: 'var(--font-display)', transition: 'all 0.2s',
                        }}>
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom amount */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Or Enter Custom Amount (₹)</label>
                  <input id="custom-amount" className="input-field" type="number" min="1" placeholder="e.g. 2500" value={form.customAmount} onChange={e => { setField('customAmount', e.target.value); setField('amount', 0); }} />
                </div>

                {/* Payment Method */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.8rem' }}>Payment Method</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {paymentMethods.map(pm => (
                      <label key={pm.id} htmlFor={`pm-${pm.id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 1.25rem', borderRadius: '12px', border: '1.5px solid', borderColor: form.paymentMethod === pm.id ? 'var(--gold)' : 'rgba(255,255,255,0.08)', background: form.paymentMethod === pm.id ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <input id={`pm-${pm.id}`} type="radio" name="paymentMethod" value={pm.id} checked={form.paymentMethod === pm.id} onChange={() => setField('paymentMethod', pm.id)} style={{ accentColor: 'var(--gold)' }} />
                        <span style={{ fontSize: '1.1rem' }}>{pm.icon}</span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--cream)' }}>{pm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Notes (Optional)</label>
                  <textarea id="donation-notes" className="input-field" rows={2} placeholder="Purpose of donation..." value={form.notes} onChange={e => setField('notes', e.target.value)} style={{ resize: 'none' }} />
                </div>

                {error && <p style={{ fontSize: '0.85rem', color: '#f87171', marginTop: '1rem' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button className="btn btn-glass" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</button>
                  <button id="next-step-2" className="btn btn-gold" onClick={() => { if (!finalAmount || finalAmount < 1) { setError('Enter a valid amount.'); return; } setError(''); setStep(3); }} style={{ flex: 2 }}>Review Donation →</button>
                </div>
              </div>
            )}

            {/* ── Step 3: Confirm ───────────────────────────────────────────── */}
            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.75rem' }}>Confirm Donation</h2>

                {/* Summary */}
                <div className="glass-gold" style={{ padding: '1.75rem', borderRadius: '16px', marginBottom: '2rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>Donation Amount</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700, color: 'var(--gold)' }}>₹{finalAmount.toLocaleString('en-IN')}</div>
                  </div>
                  {[
                    { label: 'Donor Name', value: form.donorName },
                    { label: 'Email', value: form.email },
                    { label: 'Phone', value: form.phone },
                    { label: 'Payment Method', value: paymentMethods.find(p => p.id === form.paymentMethod)?.label || form.paymentMethod },
                    ...(form.notes ? [{ label: 'Notes', value: form.notes }] : []),
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(212,175,55,0.1)', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--cream-dim)' }}>{r.label}</span>
                      <span style={{ color: 'var(--cream)', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{r.value}</span>
                    </div>
                  ))}
                </div>

                <div className="glass" style={{ padding: '1rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--cream-dim)', lineHeight: 1.6 }}>
                  🔒 Your payment is secured. A receipt (ID: GOC-{new Date().getFullYear()}-XXXX) will be emailed to <strong style={{ color: 'var(--cream)' }}>{form.email}</strong>.
                </div>

                {process.env.NEXT_PUBLIC_PAYMENT_MODE === 'mock' && (
                  <div style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                    🧪 <strong>Dev Mode:</strong> Mock payment active — no real money charged.
                  </div>
                )}

                {error && <p style={{ fontSize: '0.85rem', color: '#f87171', marginBottom: '1rem' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-glass" onClick={() => setStep(2)} disabled={loading} style={{ flex: 1 }}>← Back</button>
                  <button id="confirm-donation" className="btn btn-gold" onClick={handleDonate} disabled={loading} style={{ flex: 2 }}>
                    {loading ? '⏳ Processing...' : `🙏 Donate ₹${finalAmount.toLocaleString('en-IN')}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            {['🔒 Secure Payment', '📧 Email Receipt', '✝ Kingdom Impact'].map(b => (
              <span key={b} style={{ fontSize: '0.8rem', color: 'var(--cream-dim)' }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

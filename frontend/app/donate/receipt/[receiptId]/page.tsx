import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Donation Receipt' };

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

async function getReceipt(receiptId: string): Promise<ReceiptData | null> {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${API}/donations/receipt/${receiptId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ReceiptPage({ params }: { params: Promise<{ receiptId: string }> }) {
  const { receiptId } = await params;
  const receipt = await getReceipt(receiptId);

  if (!receipt) {
    return (
      <>
        <Navbar />
        <section className="gradient-hero" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem' }}>Receipt Not Found</h1>
            <p style={{ color: 'var(--cream-dim)', marginBottom: '2rem' }}>The receipt ID <strong>{receiptId}</strong> could not be found.</p>
            <Link href="/donate" className="btn btn-gold">Make a Donation</Link>
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

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  return (
    <>
      <Navbar />

      <section className="gradient-hero" style={{ paddingTop: '140px', paddingBottom: '4rem', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🙏</div>
          <div className="section-label" style={{ justifyContent: 'center' }}>Donation Confirmed</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
            Thank You, <span className="text-gradient-gold">{receipt.donorName.split(' ')[0]}!</span>
          </h1>
          <p style={{ color: 'var(--cream-dim)', fontSize: '1.1rem' }}>
            God bless you for your generous gift to Grace of Christ Church.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--midnight)' }}>
        <div className="container" style={{ maxWidth: '640px' }}>

          {/* Receipt Card */}
          <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: 'var(--royal)', padding: '2rem', textAlign: 'center', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '0.25rem' }}>GRACE OF CHRIST</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--cream-dim)' }}>Yetimoga, Kakinada, Andhra Pradesh · Pastor K. John Prasad</div>
            </div>

            {/* Receipt ID Banner */}
            <div style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', padding: '0.85rem', textAlign: 'center' }}>
              <span style={{ fontWeight: 700, color: '#070B14', letterSpacing: '0.1em', fontSize: '0.95rem' }}>RECEIPT ID: {receipt.receiptId}</span>
            </div>

            {/* Amount */}
            <div style={{ padding: '2.5rem', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: '0.5rem' }}>Donation Amount</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 700, color: 'var(--gold)' }}>
                ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 1rem', borderRadius: 9999, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', fontSize: '0.8rem', fontWeight: 600 }}>
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
                  <span style={{ color: 'var(--cream-dim)' }}>{r.label}</span>
                  <span style={{ color: 'var(--cream)', fontWeight: 500, textAlign: 'right', maxWidth: '58%' }}>{r.value}</span>
                </div>
              ))}
            </div>

            {/* Thank You */}
            <div style={{ background: 'rgba(212,175,55,0.05)', padding: '1.5rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--cream-dim)', lineHeight: 1.7, margin: 0 }}>
                Your PDF receipt has been emailed to <strong style={{ color: 'var(--cream)' }}>{receipt.email}</strong>. Thank you for supporting <strong style={{ color: 'var(--gold)' }}>Grace of Christ Church</strong> and the Kingdom of God!
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              id="download-receipt-pdf"
              href={`${API}/donations/receipt/${receiptId}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
            >
              ⬇ Download PDF Receipt
            </a>
            <Link href="/" className="btn btn-outline-gold">Return to Home</Link>
            <Link href="/donate" className="btn btn-glass">Give Again</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

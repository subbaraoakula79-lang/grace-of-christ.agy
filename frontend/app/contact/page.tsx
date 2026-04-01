'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="gradient-hero" style={{ paddingTop: '140px', paddingBottom: '5rem', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label" style={{ justifyContent: 'center' }}>Get In Touch</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Contact <span className="text-gradient-gold">Us</span>
          </h1>
          <p style={{ color: 'var(--cream-dim)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.8 }}>
            We&apos;d love to hear from you. Reach out with questions, prayer requests, or just to say hello.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--midnight)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            {/* Info */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Church Information</h2>

              {[
                { icon: '📍', label: 'Location', value: 'Yetimoga, Kakinada, Andhra Pradesh, India' },
                { icon: '👤', label: 'Senior Pastor', value: 'K. John Prasad' },
                { icon: '🕐', label: '1st Prayer (2nd Church)', value: '6:00 AM – 9:30 AM (Sunday)' },
                { icon: '🕐', label: '2nd Prayer (1st Church)', value: '9:30 AM – 12:30 PM (Sunday)' },
                { icon: '✉️', label: 'Email', value: 'contact@graceofchrist.org' },
              ].map(info => (
                <div key={info.label} className="glass-gold" style={{ padding: '1.25rem', borderRadius: '12px', marginBottom: '0.85rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{info.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.2rem' }}>{info.label}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--cream)' }}>{info.value}</div>
                  </div>
                </div>
              ))}

              {/* Map embed */}
              <div style={{ marginTop: '1.5rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.15)' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15309.67!2d82.2475!3d16.9891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a382fb09063fbbd%3A0xa534db2a6d73e8b6!2sKakinada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%" height="220" style={{ border: 0, display: 'block' }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="Grace of Christ Church Location"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass" style={{ padding: '2.5rem', borderRadius: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.75rem' }}>Send a Message</h2>

              {status === 'success' && (
                <div style={{ padding: '1rem 1.5rem', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  🙏 Message sent! We&apos;ll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div style={{ padding: '1rem 1.5rem', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Something went wrong. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Full Name *</label>
                    <input id="contact-name" className="input-field" type="text" placeholder="Your name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Phone</label>
                    <input id="contact-phone" className="input-field" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Email *</label>
                  <input id="contact-email" className="input-field" type="email" placeholder="your@email.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Subject</label>
                  <input id="contact-subject" className="input-field" type="text" placeholder="How can we help?" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--cream-dim)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Message *</label>
                  <textarea id="contact-message" className="input-field" rows={5} placeholder="Write your message or prayer request..." required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ resize: 'vertical' }} />
                </div>
                <button id="contact-submit" type="submit" className="btn btn-gold" disabled={status === 'loading'} style={{ marginTop: '0.5rem' }}>
                  {status === 'loading' ? 'Sending...' : 'Send Message 🙏'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

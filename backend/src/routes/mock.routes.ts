/**
 * MOCK SERVER — Development & Testing Only
 * Simulates Razorpay payment flow and email sending
 * Available at: /api/mock/*
 */
import { Router, Request, Response } from 'express';
import crypto from 'crypto';

const router = Router();

// ── Mock Razorpay ─────────────────────────────────────────────────────────────
router.post('/payment/create-order', (req: Request, res: Response) => {
  const { amount } = req.body;
  const orderId = `MOCK_ORD_${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  console.log(`[MOCK] Created payment order: ${orderId} for ₹${amount}`);
  res.json({
    id: orderId,
    amount: Math.round(amount * 100),
    currency: 'INR',
    status: 'created',
    mock: true,
    note: 'This is a mock order. In production, integrate real Razorpay.',
  });
});

router.post('/payment/verify', (req: Request, res: Response) => {
  // Mock always succeeds in development
  const paymentId = `MOCK_PAY_${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  console.log(`[MOCK] Payment verified: ${paymentId}`);
  res.json({
    verified: true,
    paymentId,
    mock: true,
    message: 'Mock payment successful! In production, real verification happens.',
  });
});

// ── Mock Email ────────────────────────────────────────────────────────────────
router.post('/email/send', (req: Request, res: Response) => {
  const { to, subject, receiptId } = req.body;
  console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Receipt: ${receiptId}`);
  res.json({
    sent: true,
    messageId: `mock_${Date.now()}@graceofchrist.dev`,
    mock: true,
    note: 'Email not actually sent. Check server console for details.',
  });
});

// ── Mock Status ───────────────────────────────────────────────────────────────
router.get('/status', (_req: Request, res: Response) => {
  res.json({
    mockServer: 'active',
    payment: process.env.PAYMENT_MODE || 'mock',
    email: process.env.EMAIL_MODE || 'mock',
    environment: process.env.NODE_ENV,
    endpoints: [
      'POST /api/mock/payment/create-order',
      'POST /api/mock/payment/verify',
      'POST /api/mock/email/send',
      'GET  /api/mock/status',
    ],
    warning: '⚠️  Mock server is for development only. Do NOT use in production.',
  });
});

export default router;

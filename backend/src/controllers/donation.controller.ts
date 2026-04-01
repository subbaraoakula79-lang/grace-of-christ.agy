import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { generateReceiptId, generateMockPaymentId, generateMockOrderId } from '../utils/receipt';
import { generateReceiptPDF } from '../utils/pdf';
import { sendDonationReceiptEmail } from '../utils/email';
import { createError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

const createDonationSchema = z.object({
  donorName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  amount: z.number().min(1).max(10000000),
  paymentMethod: z.enum(['upi', 'card', 'netbanking', 'wallet', 'cash', 'cheque']),
  notes: z.string().max(500).optional(),
  // Mock/real payment fields
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  mockConfirm: z.boolean().optional(),
});

// ── Create Donation Order ──────────────────────────────────────────────────────
export async function createDonationOrder(req: Request, res: Response): Promise<void> {
  const { amount } = z.object({ amount: z.number().min(1) }).parse(req.body);

  if (process.env.PAYMENT_MODE === 'mock') {
    const orderId = generateMockOrderId();
    res.json({
      mode: 'mock',
      orderId,
      amount,
      currency: 'INR',
      message: 'Mock payment order created. Confirm with mockConfirm: true in the donation submission.',
    });
    return;
  }

  // Real Razorpay (production)
  const Razorpay = require('razorpay');
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // paise
    currency: 'INR',
    receipt: `GOC_${Date.now()}`,
  });
  res.json({ mode: 'razorpay', orderId: order.id, amount: order.amount, currency: order.currency });
}

// ── Submit Donation After Payment ─────────────────────────────────────────────
export async function submitDonation(req: Request, res: Response): Promise<void> {
  const data = createDonationSchema.parse(req.body);
  const isMock = process.env.PAYMENT_MODE === 'mock';

  // Verify payment
  let paymentStatus: 'SUCCESS' | 'FAILED' = 'FAILED';
  let mockPaymentId: string | undefined;
  let razorpayPaymentId: string | undefined;

  if (isMock) {
    if (data.mockConfirm === true) {
      paymentStatus = 'SUCCESS';
      mockPaymentId = generateMockPaymentId();
    }
  } else {
    // Verify Razorpay signature
    const crypto = require('crypto');
    const generated = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
      .digest('hex');
    if (generated === req.body.razorpaySignature) {
      paymentStatus = 'SUCCESS';
      razorpayPaymentId = data.razorpayPaymentId;
    }
  }

  if (paymentStatus === 'FAILED') throw createError('Payment verification failed', 400);

  const receiptId = await generateReceiptId();

  const donation = await prisma.donation.create({
    data: {
      donorName: data.donorName,
      email: data.email,
      phone: data.phone,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      receiptId,
      razorpayPaymentId,
      mockPaymentId,
      status: 'SUCCESS',
      notes: data.notes,
    },
  });

  // Generate PDF receipt
  const pdfBuffer = await generateReceiptPDF({ ...donation, amount: Number(donation.amount) }) as any;

  // Send email receipt (async, don't wait)
  sendDonationReceiptEmail({
    to: donation.email,
    donorName: donation.donorName,
    receiptId: donation.receiptId,
    amount: Number(donation.amount),
    paymentMethod: donation.paymentMethod,
    date: donation.createdAt,
    pdfBuffer,
  }).catch((err) => console.error('[EMAIL ERROR]', err));

  res.status(201).json({
    success: true,
    receiptId: donation.receiptId,
    donationId: donation.id,
    message: 'Donation recorded successfully! Receipt sent to your email.',
  });
}

// ── Download Receipt PDF ──────────────────────────────────────────────────────
export async function downloadReceipt(req: Request, res: Response): Promise<void> {
  const { receiptId } = req.params;
  const donation = await prisma.donation.findUnique({ where: { receiptId } });
  if (!donation) throw createError('Receipt not found', 404);

  const pdfBuffer = await generateReceiptPDF({ ...donation, amount: Number(donation.amount) }) as any;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${receiptId}.pdf"`);
  res.send(pdfBuffer);
}

// ── Get Single Donation Details (Public — by receiptId) ───────────────────────
export async function getDonationByReceipt(req: Request, res: Response): Promise<void> {
  const { receiptId } = req.params;
  const donation = await prisma.donation.findUnique({
    where: { receiptId },
    select: {
      receiptId: true, donorName: true, email: true, phone: true,
      amount: true, paymentMethod: true, status: true, createdAt: true,
    },
  });
  if (!donation) throw createError('Receipt not found', 404);
  res.json(donation);
}

// ── Admin: List All Donations ─────────────────────────────────────────────────
export async function listDonations(req: AuthRequest, res: Response): Promise<void> {
  const { page = '1', limit = '20', search, status, from, to } = req.query as any;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = {};
  if (search) {
    where.OR = [
      { donorName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { receiptId: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const [donations, total] = await Promise.all([
    prisma.donation.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
    prisma.donation.count({ where }),
  ]);

  const totalAmount = await prisma.donation.aggregate({
    where: { ...where, status: 'SUCCESS' },
    _sum: { amount: true },
  });

  res.json({
    donations,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    stats: { totalAmount: Number(totalAmount._sum.amount || 0) },
  });
}

// ── Admin: Dashboard Stats ────────────────────────────────────────────────────
export async function getDonationStats(req: AuthRequest, res: Response): Promise<void> {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const [total, successful, totalAmount, recentDonations] = await Promise.all([
    prisma.donation.count(),
    prisma.donation.count({ where: { status: 'SUCCESS' } }),
    prisma.donation.aggregate({ where: { status: 'SUCCESS' }, _sum: { amount: true } }),
    // SQLite-compatible: fetch last 12 months of donations and group in JS
    prisma.donation.findMany({
      where: { status: 'SUCCESS', createdAt: { gte: twelveMonthsAgo } },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  // Group by year-month in JavaScript (SQLite doesn't support DATE_TRUNC)
  const monthlyMap = new Map<string, { total: number; count: number }>();
  for (const d of recentDonations) {
    const key = `${d.createdAt.getFullYear()}-${String(d.createdAt.getMonth() + 1).padStart(2, '0')}`;
    const existing = monthlyMap.get(key) || { total: 0, count: 0 };
    monthlyMap.set(key, { total: existing.total + Number(d.amount), count: existing.count + 1 });
  }
  const monthlyBreakdown = Array.from(monthlyMap.entries()).map(([month, data]) => ({ month, ...data }));

  res.json({
    totalDonations: total,
    successfulDonations: successful,
    totalRevenue: Number(totalAmount._sum.amount || 0),
    monthlyBreakdown,
  });
}

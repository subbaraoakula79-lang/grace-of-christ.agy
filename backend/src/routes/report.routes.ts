import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdminOrEditor } from '../middlewares/rbac.middleware';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Response } from 'express';

const router = Router();

// CSV Export of donations
router.get('/donations/csv', authenticate, requireAdminOrEditor, async (req: AuthRequest, res: Response) => {
  const { from, to } = req.query as any;
  const where: any = { status: 'SUCCESS' };
  if (from) where.createdAt = { ...where.createdAt, gte: new Date(from) };
  if (to) where.createdAt = { ...where.createdAt, lte: new Date(to) };

  const donations = await prisma.donation.findMany({ where, orderBy: { createdAt: 'desc' } });

  const csv = [
    ['Receipt ID', 'Donor Name', 'Email', 'Phone', 'Amount (INR)', 'Payment Method', 'Date'].join(','),
    ...donations.map((d) =>
      [
        d.receiptId, `"${d.donorName}"`, d.email, d.phone,
        Number(d.amount).toFixed(2), d.paymentMethod,
        new Date(d.createdAt).toISOString().split('T')[0],
      ].join(',')
    ),
  ].join('\n');

  const filename = `GOC_Donations_${new Date().toISOString().split('T')[0]}.csv`;
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csv);
});

// Summary stats
router.get('/summary', authenticate, requireAdminOrEditor, async (req: AuthRequest, res: Response) => {
  const [totalDonations, totalRevenue, totalEvents, totalSermons, totalMessages, totalGallery] = await Promise.all([
    prisma.donation.count({ where: { status: 'SUCCESS' } }),
    prisma.donation.aggregate({ where: { status: 'SUCCESS' }, _sum: { amount: true } }),
    prisma.event.count(),
    prisma.sermon.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.galleryImage.count(),
  ]);

  res.json({
    totalDonations,
    totalRevenue: Number(totalRevenue._sum.amount || 0),
    totalEvents,
    totalSermons,
    unreadMessages: totalMessages,
    totalGalleryImages: totalGallery,
  });
});

export default router;

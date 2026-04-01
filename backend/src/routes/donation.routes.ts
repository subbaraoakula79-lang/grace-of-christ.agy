import { Router } from 'express';
import {
  createDonationOrder,
  submitDonation,
  downloadReceipt,
  getDonationByReceipt,
  listDonations,
  getDonationStats,
} from '../controllers/donation.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdminOrEditor } from '../middlewares/rbac.middleware';
import { rateLimit } from 'express-rate-limit';

const router = Router();

const donationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many donation attempts. Please wait a minute.' },
});

// Public routes
router.post('/order', donationLimiter, createDonationOrder);
router.post('/', donationLimiter, submitDonation);
router.get('/receipt/:receiptId', getDonationByReceipt);
router.get('/receipt/:receiptId/pdf', downloadReceipt);

// Admin routes
router.get('/', authenticate, requireAdminOrEditor, listDonations);
router.get('/stats', authenticate, requireAdminOrEditor, getDonationStats);

export default router;

import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { login, refreshToken, logout, setupTOTP, verifyTOTPSetup, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { z } from 'zod';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', authLimiter, login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.post('/totp/setup', authenticate, setupTOTP);
router.post('/totp/verify', authenticate, verifyTOTPSetup);

export default router;

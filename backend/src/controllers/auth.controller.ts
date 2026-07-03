import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { generateTOTPSecret, generateTOTPUri, generateQRCode, verifyTOTP } from '../utils/totp';
import { createError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  totpToken: z.string().optional(),
});

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/auth',
};

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password, totpToken } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw createError('Invalid credentials', 401);

  const valid = await comparePassword(password, user.password);
  if (!valid) throw createError('Invalid credentials', 401);

  // ── 2FA Check (Required) ──────────────────────────────────────────────────
  if (user.totpEnabled && user.totpSecret) {
    if (!totpToken) {
      res.status(200).json({ requiresTOTP: true, message: 'Please provide your 2FA code' });
      return;
    }
    const totpValid = verifyTOTP(totpToken, user.totpSecret);
    if (!totpValid) throw createError('Invalid 2FA code', 401);
  }

  const payload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Store refresh token hash in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken, lastLoginAt: new Date() },
  });

  res.cookie('goc_refresh', refreshToken, REFRESH_COOKIE_OPTS);

  res.json({
    accessToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, totpEnabled: user.totpEnabled },
  });
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.goc_refresh;
  if (!token) throw createError('Refresh token missing', 401);

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw createError('Invalid refresh token', 401);
  }

  const user = await prisma.user.findFirst({
    where: { id: payload.userId, refreshToken: token },
  });
  if (!user) throw createError('Token revoked or invalid', 401);

  const newAccessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
  const newRefreshToken = signRefreshToken({ userId: user.id, email: user.email, role: user.role });

  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken } });
  res.cookie('goc_refresh', newRefreshToken, REFRESH_COOKIE_OPTS);

  res.json({ accessToken: newAccessToken });
}

export async function logout(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;
  if (userId) {
    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
  }
  res.clearCookie('goc_refresh', { path: '/api/auth' });
  res.json({ message: 'Logged out successfully' });
}

export async function setupTOTP(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  if (user.totpEnabled) throw createError('2FA is already enabled', 400);

  const secret = generateTOTPSecret();
  const uri = generateTOTPUri(secret, user.email);
  const qrCode = await generateQRCode(uri);

  // Store secret temporarily (not enabled yet until verified)
  await prisma.user.update({ where: { id: userId }, data: { totpSecret: secret } });

  res.json({ secret, qrCode, message: 'Scan QR code with Google Authenticator, then verify' });
}

export async function verifyTOTPSetup(req: AuthRequest, res: Response): Promise<void> {
  const { token } = z.object({ token: z.string().length(6) }).parse(req.body);
  const userId = req.user!.userId;
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  if (!user.totpSecret) throw createError('No TOTP secret found. Run setup first.', 400);

  const valid = verifyTOTP(token, user.totpSecret);
  if (!valid) throw createError('Invalid TOTP code', 400);

  await prisma.user.update({ where: { id: userId }, data: { totpEnabled: true } });
  res.json({ message: '2FA enabled successfully' });
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: req.user!.userId },
    select: { id: true, name: true, email: true, role: true, totpEnabled: true, lastLoginAt: true, createdAt: true },
  });
  res.json(user);
}

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const { name, email, currentPassword, newPassword } = updateProfileSchema.parse(req.body);

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const updateData: any = {};
  if (name) updateData.name = name;

  if (email && email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw createError('Email already in use', 400);
    updateData.email = email;
  }

  if (newPassword) {
    if (!currentPassword) {
      throw createError('Current password is required to change password', 400);
    }
    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) throw createError('Invalid current password', 400);

    updateData.password = await hashPassword(newPassword);
  }

  if (Object.keys(updateData).length === 0) {
    throw createError('No update fields provided', 400);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, totpEnabled: true },
  });

  res.json({ message: 'Profile updated successfully', user: updatedUser });
}


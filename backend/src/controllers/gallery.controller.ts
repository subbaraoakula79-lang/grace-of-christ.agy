import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { createError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { getBucket, isFirebaseConfigured } from '../utils/firebase';

export async function listGallery(req: Request, res: Response): Promise<void> {
  const { page = '1', limit = '24', category } = req.query as any;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where: any = {};
  if (category) where.category = category;

  const [images, total] = await Promise.all([
    prisma.galleryImage.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
    prisma.galleryImage.count({ where }),
  ]);
  res.json({ images, pagination: { page: parseInt(page), total, pages: Math.ceil(total / parseInt(limit)) } });
}

export async function addGalleryImage(req: AuthRequest, res: Response): Promise<void> {
  const { imageUrl, publicId, caption, category } = z.object({
    imageUrl: z.string().regex(/^(https?:\/\/[^\s]+|\/api\/[^\s]+|\/uploads\/[^\s]+)$/, 'Must be a valid URL, /api path, or legacy /uploads path'),
    publicId: z.string(),
    caption: z.string().optional(),
    category: z.string().optional(),
  }).parse(req.body);

  const image = await prisma.galleryImage.create({ data: { imageUrl, publicId, caption, category } });
  res.status(201).json(image);
}

export async function deleteGalleryImage(req: AuthRequest, res: Response): Promise<void> {
  const image = await prisma.galleryImage.findUnique({ where: { id: req.params.id } });
  if (!image) throw createError('Image not found', 404);

  // Delete from Firebase Storage if configured
  if (isFirebaseConfigured) {
    const bucket = getBucket();
    if (bucket && image.publicId) {
      // publicId stored as filename, e.g. "gallery_1234567890.jpg"
      // Full path in bucket is "goc-gallery/<publicId>"
      const filePath = image.publicId.startsWith('goc-gallery/')
        ? image.publicId
        : `goc-gallery/${image.publicId}`;
      await bucket.file(filePath).delete().catch((err: any) =>
        console.error('[Firebase Storage] Delete failed (file may not exist):', err?.message)
      );
    }
  }

  await prisma.galleryImage.delete({ where: { id: req.params.id } });
  res.json({ message: 'Image deleted' });
}

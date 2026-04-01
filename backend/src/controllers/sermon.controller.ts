import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { createError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

const sermonSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().optional(),
  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  speaker: z.string().min(2),
  date: z.string().datetime(),
  duration: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(true),
});

const mapSermon = (s: any) => ({ ...s, tags: JSON.parse(s.tags || '[]') });

export async function listSermons(req: Request, res: Response): Promise<void> {
  const { page = '1', limit = '12', search } = req.query as any;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where: any = { isPublished: true };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { speaker: { contains: search, mode: 'insensitive' } },
    ];
  }
  const [sermons, total] = await Promise.all([
    prisma.sermon.findMany({ where, skip, take: parseInt(limit), orderBy: { date: 'desc' } }),
    prisma.sermon.count({ where }),
  ]);
  res.json({ sermons: sermons.map(mapSermon), pagination: { page: parseInt(page), total, pages: Math.ceil(total / parseInt(limit)) } });
}

export async function getSermon(req: Request, res: Response): Promise<void> {
  const sermon = await prisma.sermon.findUnique({ where: { id: req.params.id } });
  if (!sermon) throw createError('Sermon not found', 404);
  res.json(mapSermon(sermon));
}

export async function createSermon(req: AuthRequest, res: Response): Promise<void> {
  const { tags, date, ...rest } = sermonSchema.parse(req.body);
  const sermon = await prisma.sermon.create({ data: { ...rest, tags: JSON.stringify(tags), date: new Date(date) } });
  res.status(201).json(mapSermon(sermon));
}

export async function updateSermon(req: AuthRequest, res: Response): Promise<void> {
  const { tags, date, ...rest } = sermonSchema.partial().parse(req.body);
  const sermon = await prisma.sermon.update({
    where: { id: req.params.id },
    data: { ...rest, ...(tags && { tags: JSON.stringify(tags) }), ...(date && { date: new Date(date) }) },
  });
  res.json(mapSermon(sermon));
}

export async function deleteSermon(req: AuthRequest, res: Response): Promise<void> {
  await prisma.sermon.delete({ where: { id: req.params.id } });
  res.json({ message: 'Sermon deleted' });
}

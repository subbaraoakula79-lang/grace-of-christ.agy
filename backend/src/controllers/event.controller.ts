import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { createError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

const eventSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  date: z.string().datetime(),
  time: z.string(),
  location: z.string().default('Grace of Christ Church'),
  imageUrl: z.string().url().optional(),
  isPublished: z.boolean().default(true),
});

export async function listEvents(req: Request, res: Response): Promise<void> {
  const { upcoming, limit = '20', page = '1', all } = req.query as any;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where: any = {};
  if (all !== 'true') where.isPublished = true;
  if (upcoming === 'true') where.date = { gte: new Date() };

  const [events, total] = await Promise.all([
    prisma.event.findMany({ where, skip, take: parseInt(limit), orderBy: { date: 'asc' } }),
    prisma.event.count({ where }),
  ]);
  res.json({ events, pagination: { page: parseInt(page), total, pages: Math.ceil(total / parseInt(limit)) } });
}

export async function getEvent(req: Request, res: Response): Promise<void> {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });
  if (!event) throw createError('Event not found', 404);
  res.json(event);
}

export async function createEvent(req: AuthRequest, res: Response): Promise<void> {
  const data = eventSchema.parse(req.body);
  const event = await prisma.event.create({ data: { ...data, date: new Date(data.date) } });
  res.status(201).json(event);
}

export async function updateEvent(req: AuthRequest, res: Response): Promise<void> {
  const data = eventSchema.partial().parse(req.body);
  const event = await prisma.event.update({
    where: { id: req.params.id },
    data: { ...data, ...(data.date && { date: new Date(data.date) }) },
  });
  res.json(event);
}

export async function deleteEvent(req: AuthRequest, res: Response): Promise<void> {
  await prisma.event.delete({ where: { id: req.params.id } });
  res.json({ message: 'Event deleted' });
}

import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(2000),
});

export async function submitContact(req: Request, res: Response): Promise<void> {
  const data = contactSchema.parse(req.body);
  await prisma.contactMessage.create({ data });
  res.status(201).json({ message: 'Message received! We will get back to you soon. 🙏' });
}

export async function listMessages(req: AuthRequest, res: Response): Promise<void> {
  const { page = '1', limit = '20', unread } = req.query as any;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where: any = {};
  if (unread === 'true') where.isRead = false;

  const [messages, total, unreadCount] = await Promise.all([
    prisma.contactMessage.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);
  res.json({ messages, pagination: { page: parseInt(page), total, pages: Math.ceil(total / parseInt(limit)) }, unreadCount });
}

export async function markAsRead(req: AuthRequest, res: Response): Promise<void> {
  await prisma.contactMessage.update({ where: { id: req.params.id }, data: { isRead: true } });
  res.json({ message: 'Marked as read' });
}

export async function deleteMessage(req: AuthRequest, res: Response): Promise<void> {
  await prisma.contactMessage.delete({ where: { id: req.params.id } });
  res.json({ message: 'Message deleted' });
}

import { Router } from 'express';
import { submitContact, listMessages, markAsRead, deleteMessage } from '../controllers/contact.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdminOrEditor } from '../middlewares/rbac.middleware';
import { rateLimit } from 'express-rate-limit';

const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

const router = Router();
router.post('/', contactLimiter, submitContact);
router.get('/', authenticate, requireAdminOrEditor, listMessages);
router.patch('/:id/read', authenticate, requireAdminOrEditor, markAsRead);
router.delete('/:id', authenticate, requireAdminOrEditor, deleteMessage);
export default router;

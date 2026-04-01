import { Router } from 'express';
import { listEvents, getEvent, createEvent, updateEvent, deleteEvent } from '../controllers/event.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdminOrEditor } from '../middlewares/rbac.middleware';

const router = Router();
router.get('/', listEvents);
router.get('/:id', getEvent);
router.post('/', authenticate, requireAdminOrEditor, createEvent);
router.put('/:id', authenticate, requireAdminOrEditor, updateEvent);
router.delete('/:id', authenticate, requireAdminOrEditor, deleteEvent);
export default router;

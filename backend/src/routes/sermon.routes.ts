import { Router } from 'express';
import { listSermons, getSermon, createSermon, updateSermon, deleteSermon } from '../controllers/sermon.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdminOrEditor } from '../middlewares/rbac.middleware';

const router = Router();
router.get('/', listSermons);
router.get('/:id', getSermon);
router.post('/', authenticate, requireAdminOrEditor, createSermon);
router.put('/:id', authenticate, requireAdminOrEditor, updateSermon);
router.delete('/:id', authenticate, requireAdminOrEditor, deleteSermon);
export default router;

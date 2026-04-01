import { Router } from 'express';
import { listGallery, addGalleryImage, deleteGalleryImage } from '../controllers/gallery.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdminOrEditor } from '../middlewares/rbac.middleware';

const router = Router();
router.get('/', listGallery);
router.post('/', authenticate, requireAdminOrEditor, addGalleryImage);
router.delete('/:id', authenticate, requireAdminOrEditor, deleteGalleryImage);
export default router;

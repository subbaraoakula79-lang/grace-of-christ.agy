import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdminOrEditor } from '../middlewares/rbac.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Response } from 'express';
import { uploadToCloudinary, isCloudinaryConfigured } from '../utils/cloudinary';

const router = Router();

// 10 MB file limit; memory storage so we can stream directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

// ── POST /api/upload/image ────────────────────────────────────────────────────
router.post(
  '/image',
  authenticate,
  requireAdminOrEditor,
  upload.single('image'),
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    // ── Dev / local fallback ─────────────────────────────────────────────────
    if (!isCloudinaryConfigured) {
      if (process.env.NODE_ENV === 'production') {
        res.status(500).json({
          error:
            'Cloudinary is not configured on the server. ' +
            'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET ' +
            'in your environment variables.',
        });
        return;
      }

      // Local dev fallback: save to disk
      const fs   = require('fs');
      const path = require('path');
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const ext      = path.extname(req.file.originalname) || '';
      const filename = `local_${Date.now()}${ext}`;
      fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);

      const localUrl = `/api/upload/local/${filename}`;
      res.json({ url: localUrl, publicId: filename, mock: true });
      return;
    }

    // ── Cloudinary Upload ────────────────────────────────────────────────────
    try {
      const path     = require('path');
      const ext      = path.extname(req.file.originalname).replace('.', '') || 'jpg';
      const filename = `gallery_${Date.now()}`;

      const { url, publicId } = await uploadToCloudinary(req.file.buffer, {
        folder:   'goc-gallery',
        filename,
        mimetype: req.file.mimetype,
      });

      console.log(`[Cloudinary] Uploaded: ${filename}.${ext} → ${url}`);
      res.json({ url, publicId });
    } catch (err: any) {
      console.error('[Cloudinary] Upload failed:', err?.message ?? err);
      res.status(500).json({
        error: 'Image upload to Cloudinary failed.',
        detail:
          process.env.NODE_ENV !== 'production'
            ? String(err?.message ?? err)
            : undefined,
      });
    }
  },
);

// ── GET /api/upload/local/:filename  (dev only — serve locally stored images) ─
router.get('/local/:filename', (req, res) => {
  const path     = require('path');
  const filename = path.basename(req.params.filename); // prevent path traversal
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

  res.sendFile(filepath, (err) => {
    if (err) {
      console.error('Error serving local file:', err);
      if (!res.headersSent) {
        res.status(404).json({ error: 'File not found' });
      }
    }
  });
});

export default router;

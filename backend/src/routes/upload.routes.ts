import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdminOrEditor } from '../middlewares/rbac.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Response } from 'express';
import { getBucket, isFirebaseConfigured } from '../utils/firebase';

const router = Router();

// 10 MB file limit; memory storage so we can stream directly to Firebase Storage
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

    const bucket = getBucket();

    // ── Dev / local fallback ─────────────────────────────────────────────────
    if (!isFirebaseConfigured || !bucket) {
      // Only reach here in local development (NODE_ENV !== 'production')
      if (process.env.NODE_ENV === 'production') {
        res.status(500).json({
          error: 'Firebase Storage is not configured on the server. ' +
                 'Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, and ' +
                 'FIREBASE_STORAGE_BUCKET in your Render environment variables.',
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

    // ── Firebase Storage Upload ──────────────────────────────────────────────
    try {
      const path = require('path');
      const ext  = path.extname(req.file.originalname) || '';
      const filename = `gallery_${Date.now()}${ext}`;
      
      // Store in goc-gallery folder in bucket
      const fileUpload = bucket.file(`goc-gallery/${filename}`);
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
          cacheControl: 'public, max-age=31536000',
        },
      });

      await new Promise<void>((resolve, reject) => {
        blobStream.on('error', (err: any) => {
          console.error('[Firebase Storage] Upload stream error:', err);
          reject(err);
        });
        blobStream.on('finish', () => {
          resolve();
        });
        blobStream.end(req.file!.buffer);
      });

      // Construct direct, clean Firebase Storage public download URL:
      // https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<folder>%2F<filename>?alt=media
      const bucketName = bucket.name;
      const encodedFilename = encodeURIComponent(`goc-gallery/${filename}`);
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedFilename}?alt=media`;

      console.log(`[Firebase Storage] Uploaded: ${filename} → ${publicUrl}`);
      res.json({ url: publicUrl, publicId: filename });
    } catch (err: any) {
      console.error('[Firebase Storage] Upload failed:', err?.message ?? err);
      res.status(500).json({
        error: 'Image upload to Firebase Storage failed.',
        detail: process.env.NODE_ENV !== 'production' ? String(err?.message ?? err) : undefined,
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

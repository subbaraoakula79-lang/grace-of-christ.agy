import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdminOrEditor } from '../middlewares/rbac.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Response } from 'express';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/image', authenticate, requireAdminOrEditor, upload.single('image'), async (req: AuthRequest, res: Response) => {
  if (!req.file) { res.status(400).json({ error: 'No file provided' }); return; }

  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
    // Mock upload for dev
    const mockUrl = `https://picsum.photos/seed/${Date.now()}/800/600`;
    res.json({ url: mockUrl, publicId: `mock_${Date.now()}`, mock: true });
    return;
  }

  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'goc-gallery', quality: 'auto', fetch_format: 'auto' },
      (err, result) => { if (err) reject(err); else resolve(result); }
    ).end(req.file!.buffer);
  });

  res.json({ url: result.secure_url, publicId: result.public_id });
});

export default router;

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
    // Local upload for dev
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    
    const ext = path.extname(req.file.originalname) || '';
    const filename = `local_${Date.now()}${ext}`;
    fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
    
    const localUrl = `/api/upload/local/${filename}`;
    res.json({ url: localUrl, publicId: filename, mock: true });
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

// Serve the local images
router.get('/local/:filename', (req, res) => {
  const path = require('path');
  const filename = path.basename(req.params.filename);
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

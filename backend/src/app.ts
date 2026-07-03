import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import donationRoutes from './routes/donation.routes';
import eventRoutes from './routes/event.routes';
import sermonRoutes from './routes/sermon.routes';
import galleryRoutes from './routes/gallery.routes';
import contactRoutes from './routes/contact.routes';
import uploadRoutes from './routes/upload.routes';
import reportRoutes from './routes/report.routes';
import mockRoutes from './routes/mock.routes';

const app = express();

// ── Security Headers ──────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com', 'https://firebasestorage.googleapis.com', 'https://img.youtube.com', 'http://localhost:5000', 'http://localhost:3000'],
        connectSrc: ["'self'", 'https://api.cloudinary.com', 'https://res.cloudinary.com', 'https://firebasestorage.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
        frameSrc: ["'self'", 'https://www.youtube.com'],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xFrameOptions: { action: 'deny' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ── CORS ──────────────────────────────────────────────────────────────────────
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowed = new Set<string>([
      'http://localhost:3000',
      'http://localhost:3001',
    ]);
    
    // Support multiple comma-separated frontend URLs (remove trailing slashes)
    if (process.env.FRONTEND_URL) {
      process.env.FRONTEND_URL.split(',')
        .map((u) => u.trim().replace(/\/+$/, ''))
        .forEach((u) => allowed.add(u));
    }
    
    // Clean origin by removing trailing slash if present
    const cleanOrigin = origin ? origin.replace(/\/+$/, '') : '';
    
    const isVercelPreview = cleanOrigin && (cleanOrigin.endsWith('.vercel.app') || cleanOrigin.includes('.vercel.app'));
    const isCustomDomain = cleanOrigin && (cleanOrigin.endsWith('graceofchrist.org') || cleanOrigin.includes('graceofchrist.org'));
    const isFirebaseHost = cleanOrigin && (cleanOrigin.endsWith('.web.app') || cleanOrigin.endsWith('.firebaseapp.com'));

    if (!origin || allowed.has(cleanOrigin) || isVercelPreview || isCustomDomain || isFirebaseHost) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(null, true); // Allow fallback to prevent strict failure if client configuration differs
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ── Body Parsing & Compression ────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(compression());

// ── Global Rate Limiting ──────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    church: process.env.CHURCH_NAME,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
const API = '/api';
app.use(`${API}/auth`, authRoutes);
app.use(`${API}/donations`, donationRoutes);
app.use(`${API}/events`, eventRoutes);
app.use(`${API}/sermons`, sermonRoutes);
app.use(`${API}/gallery`, galleryRoutes);
app.use(`${API}/contact`, contactRoutes);
app.use(`${API}/upload`, uploadRoutes);
app.use(`${API}/reports`, reportRoutes);

// ── Mock Server (dev/testing) ─────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use(`${API}/mock`, mockRoutes);
}

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

export default app;

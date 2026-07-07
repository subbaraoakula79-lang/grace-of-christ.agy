import 'dotenv/config';
import app from './app';
import { prisma, disconnectPrisma } from './utils/prisma';
import bcrypt from 'bcryptjs';

const PORT = parseInt(process.env.PORT || '5000', 10);

// ── Validate required environment variables ───────────────────────────────────
function validateEnv() {
  const required = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('   Set them in your .env file (local) or Render dashboard (production).');
    process.exit(1);
  }
}

// ── Ensure admin user exists (only creates if not present) ────────────────────
async function ensureAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@graceofchrist.org';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Graceofchrist@2026';

  try {
    // Check if admin already exists — do NOT overwrite the password on update.
    // Re-hashing on every restart would invalidate the stored hash and break login.
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (existing) {
      console.log(`✅ Admin user already exists: ${adminEmail}`);
      return;
    }

    // Only hash and create if the admin doesn't exist yet
    const hashed = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        name: 'K. John Prasad',
        email: adminEmail,
        password: hashed,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
    console.log(`   Default password set — change it via /admin/settings after first login.`);
  } catch (err: any) {
    console.error('⚠️ Could not ensure admin user:', err?.message || err);
  }
}

async function bootstrap() {
  // Fail fast if required env vars are missing
  validateEnv();

  let dbConnected = false;

  // Attempt database connection (non-fatal in dev if unreachable)
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL database connected via Prisma');
    dbConnected = true;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Failed to connect to database in production:', error);
      process.exit(1);
    }
    console.warn('⚠️ Database connection failed (local dev may have port 5432 blocked).');
    console.warn(`   Error: ${error?.message || error}`);
    console.warn('   Server will start, but DB-dependent routes will fail.\n');
  }

  // Seed admin if connected
  if (dbConnected) {
    await ensureAdminUser();
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Grace of Christ API running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log(`   Database: ${dbConnected ? '✅ Connected' : '⚠️ Not connected'}`);
    console.log(`   Payment mode: ${process.env.PAYMENT_MODE}`);
    console.log(`   Email mode: ${process.env.EMAIL_MODE}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`   Mock server: http://localhost:${PORT}/api/mock`);
    }
  });
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await disconnectPrisma();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await disconnectPrisma();
  process.exit(0);
});

bootstrap();

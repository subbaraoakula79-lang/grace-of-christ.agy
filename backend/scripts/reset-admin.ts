/**
 * reset-admin.ts
 * ─────────────────────────────────────────────────────────────
 * One-time script: wipes the admin's stored password hash and
 * writes a fresh, known-good one. Run whenever the hash in DB
 * is out of sync with the plaintext password.
 *
 * Usage:
 *   npx ts-node scripts/reset-admin.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Validate env before anything else so the type is narrowed to string
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Check your .env file.');
  process.exit(1);
}

const prisma = new PrismaClient({
  log: ['error'],
  datasources: {
    db: { url: process.env.DATABASE_URL as string },
  },
});

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@graceofchrist.org';
  const password = process.env.ADMIN_PASSWORD || 'Graceofchrist@2026';

  console.log('\n🔧 Admin Password Reset Tool');
  console.log('────────────────────────────────');
  console.log(`   Target email : ${email}`);
  console.log(`   DATABASE_URL : ${process.env.DATABASE_URL ? '✅ set' : '❌ MISSING'}`);
  console.log(`   JWT_ACCESS_SECRET : ${process.env.JWT_ACCESS_SECRET ? '✅ set' : '❌ MISSING'}`);
  console.log();


  console.log('⏳ Connecting to database...');
  await prisma.$connect();
  console.log('✅ Connected.\n');

  console.log('⏳ Hashing password...');
  const hash = await bcrypt.hash(password, 12);

  console.log('⏳ Writing to database (upsert)...');
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hash, role: 'ADMIN' },
    create: { name: 'K. John Prasad', email, password: hash, role: 'ADMIN' },
  });

  console.log(`✅ Admin user upserted: ${user.email} (id: ${user.id})`);

  // Immediately verify the hash is correct
  const ok = await bcrypt.compare(password, user.password);
  console.log(`✅ bcrypt.compare verification: ${ok ? 'PASS ✅' : 'FAIL ❌'}`);

  if (!ok) {
    console.error('❌ Hash verification failed — something is wrong with bcrypt.');
    process.exit(1);
  }

  console.log('\n🎉 Done. Admin login should now work.');
  console.log(`   Email    : ${email}`);
  console.log(`   Password : ${password}`);
}

main()
  .catch((err) => {
    console.error('\n❌ Script failed:', err.message || err);
    if (err.code) console.error('   Prisma error code:', err.code);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

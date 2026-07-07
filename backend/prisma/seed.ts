import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Admin user — only create if not already present.
  // Do NOT use upsert with `update: { password }`: bcrypt generates a different
  // hash every call, so overwriting the hash on every seed run breaks login.
  const adminEmail = 'admin@graceofchrist.org';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existingAdmin) {
    console.log(`ℹ️  Admin user already exists: ${adminEmail} (skipped)`);
  } else {
    const adminPassword = await bcrypt.hash('Graceofchrist@2026', 12);
    const admin = await prisma.user.create({
      data: {
        name: 'K. John Prasad',
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Admin user created: ${admin.email}`);
    console.log(`   Password: Graceofchrist@2026\n`);
  }

  console.log('🎉 Database seeded successfully!');
  console.log('\n⚠️  IMPORTANT: Change the admin password before going live!');
  console.log('   Admin URL: http://localhost:3000/admin/login');
  console.log('   Admin Email: admin@graceofchrist.org');
  console.log('   Admin Password: Graceofchrist@2026');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());

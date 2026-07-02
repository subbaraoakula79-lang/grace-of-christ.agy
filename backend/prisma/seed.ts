import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Admin user
  const adminPassword = await bcrypt.hash('Graceofchrist@2026', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@graceofchrist.org' },
    update: {
      password: adminPassword,
    },
    create: {
      name: 'K. John Prasad',
      email: 'admin@graceofchrist.org',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);
  console.log(`   Password: Graceofchrist@2026\n`);

  console.log('🎉 Database seeded successfully!');
  console.log('\n⚠️  IMPORTANT: Change the admin password before going live!');
  console.log('   Admin URL: http://localhost:3000/admin/login');
  console.log('   Admin Email: admin@graceofchrist.org');
  console.log('   Admin Password: Graceofchrist@2026');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());

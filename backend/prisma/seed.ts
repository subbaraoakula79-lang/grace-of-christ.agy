import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@GOC2024!', 12);
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
  console.log(`   Password: Admin@GOC2024!\n`);

  console.log('🎉 Database seeded successfully!');
  console.log('\n⚠️  IMPORTANT: Change the admin password before going live!');
  console.log('   Admin URL: http://localhost:3000/admin/login');
  console.log('   Admin Email: admin@graceofchrist.org');
  console.log('   Admin Password: Admin@GOC2024!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());

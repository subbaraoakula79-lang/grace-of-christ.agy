import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@GOC2024!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@graceofchrist.org' },
    update: {},
    create: {
      name: 'K. John Prasad',
      email: 'admin@graceofchrist.org',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);
  console.log(`   Password: Admin@GOC2024! (change this immediately!)\n`);

  // Sample events
  const events = [
    {
      title: 'Sunday Worship Service',
      description: 'Join us for our weekly Sunday worship service with praise, prayer, and the Word of God.',
      date: new Date('2026-04-06T06:00:00+05:30'),
      time: '6:00 AM – 12:30 PM',
      location: 'Grace of Christ Church, Yetimoga',
    },
    {
      title: 'Good Friday Service',
      description: 'A solemn service commemorating the crucifixion of Jesus Christ and his death at Calvary.',
      date: new Date('2026-04-03T05:30:00+05:30'),
      time: '5:30 AM – 9:00 AM',
      location: 'Grace of Christ Church, Yetimoga',
    },
    {
      title: 'Easter Sunday Celebration',
      description: 'Celebrate the resurrection of our Lord Jesus Christ with joy, music, and community fellowship.',
      date: new Date('2026-04-05T06:00:00+05:30'),
      time: '6:00 AM – 1:00 PM',
      location: 'Grace of Christ Church, Yetimoga',
    },
    {
      title: 'Youth Prayer Night',
      description: 'A night of prayer, worship, and fellowship for young believers.',
      date: new Date('2026-04-10T19:00:00+05:30'),
      time: '7:00 PM – 10:00 PM',
      location: 'Grace of Christ Church, Yetimoga',
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { id: `seed_${event.title.replace(/\s+/g, '_').toLowerCase()}` },
      update: {},
      create: { id: `seed_${event.title.replace(/\s+/g, '_').toLowerCase()}`, ...event },
    });
  }
  console.log(`✅ Created ${events.length} sample events\n`);

  // Sample sermons
  const sermons = [
    {
      title: 'Walking in God\'s Grace',
      description: 'A message about living daily in the grace that God provides through Jesus Christ.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      speaker: 'Pastor K. John Prasad',
      date: new Date('2026-03-23'),
      tags: ['Grace', 'Faith', 'Daily Life'],
    },
    {
      title: 'The Power of Prayer',
      description: 'Discover the transformative power of consistent prayer in a believer\'s life.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      speaker: 'Pastor K. John Prasad',
      date: new Date('2026-03-16'),
      tags: ['Prayer', 'Faith', 'Spiritual Growth'],
    },
    {
      title: 'Hope in Times of Trial',
      description: 'Finding hope and strength through God\'s promises during difficult seasons of life.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      speaker: 'Pastor K. John Prasad',
      date: new Date('2026-03-09'),
      tags: ['Hope', 'Trials', 'Promises'],
    },
  ];

  for (const sermon of sermons) {
    const { tags, ...rest } = sermon;
    await prisma.sermon.upsert({
      where: { id: `seed_sermon_${sermon.date.toISOString().split('T')[0]}` },
      update: {},
      create: { id: `seed_sermon_${sermon.date.toISOString().split('T')[0]}`, ...rest, tags: JSON.stringify(tags) },
    });
  }
  console.log(`✅ Created ${sermons.length} sample sermons\n`);

  // Sample donation
  await prisma.donation.upsert({
    where: { receiptId: 'GOC-2026-0001' },
    update: {},
    create: {
      donorName: 'Sample Donor',
      email: 'donor@example.com',
      phone: '9876543210',
      amount: 1001.00,
      paymentMethod: 'upi',
      receiptId: 'GOC-2026-0001',
      mockPaymentId: 'MOCK_PAY_SEED001',
      status: 'SUCCESS',
    },
  });
  console.log('✅ Created sample donation (Receipt: GOC-2026-0001)\n');

  console.log('🎉 Database seeded successfully!');
  console.log('\n⚠️  IMPORTANT: Change the admin password before going live!');
  console.log('   Admin URL: http://localhost:3000/admin/login');
  console.log('   Admin Email: admin@graceofchrist.org');
  console.log('   Admin Password: Admin@GOC2024!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());

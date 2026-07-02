import 'dotenv/config';
import app from './app';
import { prisma, disconnectPrisma } from './utils/prisma';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL database connected via Prisma');

    app.listen(PORT, () => {
      console.log(`\n🚀 Grace of Christ API running on http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV}`);
      console.log(`   Payment mode: ${process.env.PAYMENT_MODE}`);
      console.log(`   Email mode: ${process.env.EMAIL_MODE}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`   Mock server: http://localhost:${PORT}/api/mock`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await disconnectPrisma();
    process.exit(1);
  }
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

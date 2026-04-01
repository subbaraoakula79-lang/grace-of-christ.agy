import 'dotenv/config';
import app from './app';
import { prisma } from './utils/prisma';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

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
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();

import crypto from 'crypto';
import { prisma } from './prisma';

let counter = 1000;

export async function generateReceiptId(): Promise<string> {
  const year = new Date().getFullYear();
  
  // Count existing donations this year for sequential numbering
  const count = await prisma.donation.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
  });
  
  const seq = String(count + 1).padStart(4, '0');
  return `GOC-${year}-${seq}`;
}

export function generateMockPaymentId(): string {
  return `MOCK_PAY_${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
}

export function generateMockOrderId(): string {
  return `MOCK_ORD_${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
}

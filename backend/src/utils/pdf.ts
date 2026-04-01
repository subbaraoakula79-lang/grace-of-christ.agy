import PDFDocument from 'pdfkit';
import { Decimal } from '@prisma/client/runtime/library';
import path from 'path';
import fs from 'fs';

interface ReceiptData {
  receiptId: string;
  donorName: string;
  email: string;
  phone: string;
  amount: Decimal | number;
  paymentMethod: string;
  status: string;
  createdAt: Date;
}

const LOGO_PATH = path.join(__dirname, '../../assets/logo.png');
const PRIMARY_COLOR = '#0E1E3D';
const GOLD_COLOR = '#D4AF37';
const LIGHT_COLOR = '#F0EDE8';

export function generateReceiptPDF(data: ReceiptData): Buffer {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Donation Receipt - ${data.receiptId}`,
        Author: 'Grace of Christ Church',
        Subject: 'Donation Receipt',
      },
    });

    const buffers: Buffer[] = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // ── Header Background ────────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 140).fill(PRIMARY_COLOR);

    // ── Logo ─────────────────────────────────────────────────────────────────
    if (fs.existsSync(LOGO_PATH)) {
      doc.image(LOGO_PATH, 50, 20, { width: 70, height: 70 });
    }

    // ── Church Header ─────────────────────────────────────────────────────────
    doc
      .fillColor(GOLD_COLOR)
      .font('Helvetica-Bold')
      .fontSize(22)
      .text('GRACE OF CHRIST', 130, 30, { align: 'left' });

    doc
      .fillColor(LIGHT_COLOR)
      .font('Helvetica')
      .fontSize(10)
      .text('Yetimoga, Kakinada, Andhra Pradesh, India', 130, 60)
      .text('Pastor: K. John Prasad', 130, 76)
      .text('www.graceofchrist.org', 130, 92);

    doc
      .fillColor(GOLD_COLOR)
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('DONATION RECEIPT', 0, 108, { align: 'right', width: doc.page.width - 50 });

    // ── Receipt ID Banner ─────────────────────────────────────────────────────
    doc.rect(0, 140, doc.page.width, 36).fill(GOLD_COLOR);
    doc
      .fillColor(PRIMARY_COLOR)
      .font('Helvetica-Bold')
      .fontSize(13)
      .text(`Receipt ID: ${data.receiptId}`, 50, 151, { align: 'center', width: doc.page.width - 100 });

    // ── Body ──────────────────────────────────────────────────────────────────
    const startY = 208;
    doc.fillColor(PRIMARY_COLOR);

    // Divider helper
    const divider = (y: number) => {
      doc.strokeColor('#E0DCDC').lineWidth(0.5).moveTo(50, y).lineTo(doc.page.width - 50, y).stroke();
    };

    // Row helper
    const row = (label: string, value: string, y: number, highlight = false) => {
      doc.fillColor('#666666').font('Helvetica').fontSize(10).text(label, 50, y);
      doc
        .fillColor(highlight ? GOLD_COLOR : PRIMARY_COLOR)
        .font(highlight ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(highlight ? 13 : 11)
        .text(value, 200, y, { align: 'left' });
    };

    doc.fillColor(PRIMARY_COLOR).font('Helvetica-Bold').fontSize(13).text('Donor Information', 50, startY);
    divider(startY + 18);

    row('Donor Name', data.donorName, startY + 28);
    row('Email Address', data.email, startY + 50);
    row('Phone Number', data.phone, startY + 72);

    const payY = startY + 110;
    doc.fillColor(PRIMARY_COLOR).font('Helvetica-Bold').fontSize(13).text('Payment Details', 50, payY);
    divider(payY + 18);

    const amountNum = typeof data.amount === 'object' ? Number(data.amount) : data.amount;
    row('Amount Donated', `₹${amountNum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, payY + 28, true);
    row('Payment Method', data.paymentMethod.toUpperCase(), payY + 52);
    row('Payment Status', data.status.toUpperCase(), payY + 74);
    row('Date & Time', new Date(data.createdAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }), payY + 96);

    // ── Thank You Section ─────────────────────────────────────────────────────
    const thankY = payY + 150;
    doc.rect(50, thankY, doc.page.width - 100, 80).fill('#F9F6EE');
    doc
      .fillColor(PRIMARY_COLOR)
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('Thank You for Your Generous Gift!', 50, thankY + 14, { align: 'center', width: doc.page.width - 100 });
    doc
      .fillColor('#555555')
      .font('Helvetica')
      .fontSize(10)
      .text(
        'Your donation supports the ministry of Grace of Christ Church and helps spread Hope, Love, and Faith in our community.',
        70, thankY + 36,
        { align: 'center', width: doc.page.width - 140 }
      );

    // ── Footer ────────────────────────────────────────────────────────────────
    doc.rect(0, doc.page.height - 60, doc.page.width, 60).fill(PRIMARY_COLOR);
    doc
      .fillColor(GOLD_COLOR)
      .font('Helvetica')
      .fontSize(9)
      .text(
        'This is a computer-generated receipt. Grace of Christ (GOC) • Yetimoga, Kakinada, AP, India',
        50, doc.page.height - 44,
        { align: 'center', width: doc.page.width - 100 }
      );
    doc
      .fillColor(LIGHT_COLOR)
      .fontSize(8)
      .text(
        `Generated on ${new Date().toLocaleDateString('en-IN')} • For queries: contact@graceofchrist.org`,
        50, doc.page.height - 28,
        { align: 'center', width: doc.page.width - 100 }
      );

    doc.end();
  }) as unknown as Buffer;
}

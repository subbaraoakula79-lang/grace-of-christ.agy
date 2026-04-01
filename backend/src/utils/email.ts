import nodemailer from 'nodemailer';

interface ReceiptEmailData {
  to: string;
  donorName: string;
  receiptId: string;
  amount: number;
  paymentMethod: string;
  date: Date;
  pdfBuffer: Buffer;
}

function createMockTransporter() {
  return {
    sendMail: async (options: any) => {
      console.log('\n📧 [MOCK EMAIL] Would send email:');
      console.log(`   To: ${options.to}`);
      console.log(`   Subject: ${options.subject}`);
      console.log(`   Receipt ID: ${options.attachments?.[0]?.filename}`);
      console.log('   ✅ Mock email sent successfully\n');
      return { messageId: `mock-${Date.now()}@graceofchrist.org` };
    },
  };
}

function createSmtpTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendDonationReceiptEmail(data: ReceiptEmailData): Promise<void> {
  const isMock = process.env.EMAIL_MODE !== 'smtp';
  const transporter = isMock ? createMockTransporter() : createSmtpTransporter();

  const amountFormatted = `₹${data.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  const dateFormatted = new Date(data.date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: #0E1E3D; padding: 32px; text-align: center; }
    .header h1 { color: #D4AF37; margin: 0 0 4px; font-size: 24px; }
    .header p { color: #F0EDE8; margin: 0; font-size: 13px; }
    .body { padding: 32px; }
    .badge { background: #D4AF37; color: #0E1E3D; padding: 8px 20px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block; margin-bottom: 24px; }
    .amount { font-size: 36px; font-weight: bold; color: #0E1E3D; margin: 16px 0; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    td { padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; }
    td:first-child { color: #888; width: 40%; }
    td:last-child { color: #0E1E3D; font-weight: 500; }
    .thanks { background: #f9f6ee; border-radius: 8px; padding: 20px; text-align: center; margin-top: 24px; }
    .footer { background: #0E1E3D; padding: 20px; text-align: center; color: #888; font-size: 12px; }
    .footer a { color: #D4AF37; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Grace of Christ</h1>
      <p>Yetimoga, Kakinada, Andhra Pradesh, India</p>
    </div>
    <div class="body">
      <p style="font-size:16px; color:#333;">Dear <strong>${data.donorName}</strong>,</p>
      <p style="color:#555;">Thank you for your generous donation to Grace of Christ Church. Your giving makes a difference!</p>
      <div class="badge">Receipt: ${data.receiptId}</div>
      <div class="amount">${amountFormatted}</div>
      <table>
        <tr><td>Donor Name</td><td>${data.donorName}</td></tr>
        <tr><td>Payment Method</td><td>${data.paymentMethod.toUpperCase()}</td></tr>
        <tr><td>Date</td><td>${dateFormatted}</td></tr>
        <tr><td>Status</td><td style="color:#22c55e;">✅ Successful</td></tr>
      </table>
      <div class="thanks">
        <strong style="color:#0E1E3D;">🙏 God Bless You!</strong>
        <p style="color:#666; font-size:13px; margin:8px 0 0;">Your PDF receipt is attached. Keep it for your records.</p>
      </div>
    </div>
    <div class="footer">
      <p>Grace of Christ (GOC) &bull; Pastor: K. John Prasad</p>
      <p><a href="mailto:contact@graceofchrist.org">contact@graceofchrist.org</a></p>
      ${isMock ? '<p style="color:#f97316;">[MOCK MODE — Email not actually sent]</p>' : ''}
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Grace of Christ" <noreply@graceofchrist.org>',
    to: data.to,
    subject: `Donation Receipt ${data.receiptId} — Grace of Christ`,
    html,
    attachments: [
      {
        filename: `${data.receiptId}.pdf`,
        content: data.pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}

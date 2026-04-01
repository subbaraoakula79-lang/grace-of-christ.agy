import { authenticator } from 'otplib';
import QRCode from 'qrcode';

authenticator.options = {
  digits: 6,
  step: 30,
  window: 1,
};

export function generateTOTPSecret(): string {
  return authenticator.generateSecret(32);
}

export function generateTOTPUri(secret: string, email: string): string {
  const issuer = process.env.TOTP_ISSUER || 'GraceOfChrist';
  return authenticator.keyuri(email, issuer, secret);
}

export async function generateQRCode(uri: string): Promise<string> {
  return QRCode.toDataURL(uri);
}

export function verifyTOTP(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret });
}

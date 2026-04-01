import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Grace of Christ Church | Yetimoga, Kakinada',
    template: '%s | Grace of Christ',
  },
  description:
    'Grace of Christ (GOC) — A spirit-filled church in Yetimoga, Kakinada, Andhra Pradesh. Led by Pastor K. John Prasad. Join us for worship, prayer, and community.',
  keywords: ['Grace of Christ', 'GOC Church', 'Kakinada', 'Yetimoga', 'Andhra Pradesh', 'Church', 'Pastor John Prasad'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://graceofchrist.org',
    siteName: 'Grace of Christ',
    title: 'Grace of Christ Church | Yetimoga, Kakinada',
    description: 'A spirit-filled church community in Yetimoga, Kakinada, AP.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-midnight text-cream antialiased">{children}</body>
    </html>
  );
}

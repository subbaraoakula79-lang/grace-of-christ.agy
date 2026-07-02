import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
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

export const viewport: Viewport = {
  themeColor: '#070D0C',
};

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
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload logo (LCP element) */}
        <link rel="preload" href="/logo.png" as="image" />
        {/*
          Anti-flash script: Runs synchronously before first paint.
          Reads the saved theme from localStorage and sets data-theme on <html>
          so the correct CSS variables are applied before React hydrates.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('goc_theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

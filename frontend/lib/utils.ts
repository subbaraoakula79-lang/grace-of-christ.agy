// ── Church Constants ──────────────────────────────────────────────────────────
export const CHURCH = {
  name: 'Grace of Christ',
  shortName: 'GOC',
  fullName: 'Grace of Christ (GOC)',
  location: 'Yetimoga, Kakinada, Andhra Pradesh, India',
  pastor: 'K. John Prasad',
  email: 'contact@graceofchrist.org',
  website: 'https://graceofchrist.org',
  prayer: [
    { label: '1st Prayer · 2nd Church', time: '6:00 AM – 9:30 AM' },
    { label: '2nd Prayer · 1st Church', time: '9:30 AM – 12:30 PM' },
  ],
} as const;

// ── Format Helpers ────────────────────────────────────────────────────────────
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── Receipt ID Generator (for display) ───────────────────────────────────────
export function previewReceiptId(): string {
  const year = new Date().getFullYear();
  return `GOC-${year}-XXXX`;
}

// ── YouTube Video ID Extractor ────────────────────────────────────────────────
export function getYouTubeId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/);
  return match?.[1] || '';
}

export function getYouTubeThumbnail(url: string, quality: 'hq' | 'mq' = 'hq'): string {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/${quality}default.jpg` : '';
}

// ── Class Names Helper ────────────────────────────────────────────────────────
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

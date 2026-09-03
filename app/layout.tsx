import type { Metadata } from 'next';
import { DM_Mono, Syne } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://void.store'),
  title: { default: 'VOID.STORE｜Curated objects from the void', template: '%s｜VOID.STORE' },
  description: 'VOID.STORE — 由 _null 精選的手作、選品與礦石。每一件都經過挑選,不留贅語。',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'VOID.STORE',
    title: 'VOID.STORE｜Curated objects from the void',
    description: 'Handmade · Pre-loved · Minerals. Nothing filler.',
  },
  twitter: { card: 'summary_large_image', title: 'VOID.STORE', description: 'Curated objects from the void.' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" className={`${syne.variable} ${dmMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

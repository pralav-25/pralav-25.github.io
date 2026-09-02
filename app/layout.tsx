import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://pralav-25.github.io'),
  title: 'Pralav Singh — Developer & Creative Technologist',
  description: 'Portfolio of Pralav Singh: responsive web products, interactive prototypes, API security concepts, and visual storytelling.',
  authors: [{ name: 'Pralav Singh', url: 'https://github.com/pralav-25' }],
  keywords: ['Pralav Singh', 'web developer', 'frontend developer', 'React', 'FastAPI', 'video editor', 'portfolio'],
  openGraph: {
    title: 'Pralav Singh — Developer & Creative Technologist',
    description: 'Engineering clear digital products across web development, prototypes, security, and visual storytelling.',
    url: 'https://pralav-25.github.io',
    siteName: 'Pralav Singh',
    type: 'website',
    images: [{ url: '/og.png', width: 1730, height: 909, alt: 'Pralav Singh — Developer & Creative Technologist' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pralav Singh — Developer & Creative Technologist',
    description: 'Engineering clear digital products across web development, prototypes, security, and visual storytelling.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}

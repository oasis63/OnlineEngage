import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Womegle — Anonymous 1-on-1 Video & Text Chat India',
  description: 'Production-quality anonymous random video, voice & text chat platform for India. Connect instantly with strangers by gender preference, 8 Indian languages, and shared interests.',
  keywords: ['Womegle', 'Womegle India', 'Omegle Alternative India', 'Anonymous Video Chat', 'Random Chat India', 'Hindi Video Chat', 'Indian Omegle'],
  metadataBase: new URL('https://womegle.in'),
  alternates: {
    canonical: 'https://womegle.in',
  },
  openGraph: {
    title: 'Womegle — Anonymous 1-on-1 Video & Text Chat India',
    description: 'Connect instantly with strangers across India by gender preference, language, and interests.',
    url: 'https://womegle.in',
    siteName: 'Womegle',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}

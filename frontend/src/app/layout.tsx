import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Womegle — Best Omegle Alternative for Online Chat, Video & Voice in India',
  description: 'Looking for Omegle online chat, online video, or online voice call? Womegle is India\'s #1 free anonymous random chat platform with gender preference, 8 Indian languages, and instant video matching.',
  keywords: [
    'Omegle online chat',
    'Omegle online video',
    'Omegle online voice',
    'Omegle alternative India',
    'Womegle',
    'Womegle India',
    'Random video chat India',
    'Hindi video chat',
    'Indian Omegle',
    'Talk to strangers online',
  ],
  metadataBase: new URL('https://womegle.in'),
  alternates: {
    canonical: 'https://womegle.in',
  },
  openGraph: {
    title: 'Womegle — #1 Omegle Alternative for Online Chat, Video & Voice',
    description: 'Connect instantly with strangers across India via 1-on-1 video, voice calls, and text chat. Gender preference & 8 Indian languages support.',
    url: 'https://womegle.in',
    siteName: 'Womegle',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Womegle',
  url: 'https://womegle.in',
  description: 'Free anonymous 1-on-1 online chat, online video, and online voice platform for India.',
  applicationCategory: 'CommunicationApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}

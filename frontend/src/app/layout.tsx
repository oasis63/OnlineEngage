import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Womegle – Free Anonymous Random Video & Text Chat India',
  description: 'Connect instantly with strangers across India via 1-on-1 random video, voice & text chat. Gender preference matching, 8 Indian languages, and zero registration at Womegle.in.',
  keywords: [
    'Womegle',
    'womegle.in',
    'Womegle India',
    'Omegle alternative India',
    'Random video chat India',
    'Anonymous video chat',
    'Hindi video chat',
    'Indian Omegle',
    'Talk to strangers online',
    'Free video call strangers',
  ],
  metadataBase: new URL('https://womegle.in'),
  alternates: {
    canonical: 'https://womegle.in',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Womegle – Free Anonymous Random Video & Text Chat India',
    description: 'Connect instantly with strangers across India via 1-on-1 random video, voice & text chat. Gender preference matching & 8 Indian languages.',
    url: 'https://womegle.in',
    siteName: 'Womegle',
    images: [
      {
        url: 'https://womegle.in/icon.png',
        width: 512,
        height: 512,
        alt: 'Womegle Logo',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Womegle – Free Anonymous Random Video & Text Chat India',
    description: 'Connect instantly with strangers across India via 1-on-1 random video, voice & text chat.',
    images: ['https://womegle.in/icon.png'],
  },
};

const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Womegle',
  alternateName: ['Womegle India', 'Womegle.in', 'Omegle Alternative India'],
  url: 'https://womegle.in',
};

const jsonLdSoftware = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
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

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Womegle',
  url: 'https://womegle.in',
  logo: 'https://womegle.in/icon.png',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

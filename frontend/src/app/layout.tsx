import React from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
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
  title: 'Womegle – Free Online Chat, Random Video Calls & Voice Chat India',
  description: 'Womegle is India\'s #1 free anonymous online chat, random video call & voice chat platform. Connect 1-on-1 with strangers instantly by gender preference and 8 Indian languages.',
  keywords: [
    'online chat',
    'online video calls',
    'online voice chats',
    'random video chat',
    'anonymous chat India',
    'talk to strangers',
    'Omegle alternative India',
    'Womegle',
    'womegle.in',
    'free online chat',
    'video chat with strangers',
    'voice call with strangers',
    'chat with girls India',
    'safe random chat',
    'Indian Omegle',
    'Hindi online chat',
    'Tamil video chat',
    'Telugu anonymous chat',
    '1 on 1 video call',
    'cam chat India',
    'no registration chat',
    'instant stranger chat',
    'free random video call',
    'live video chat India',
    'anonymous audio call',
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
  manifest: '/manifest.json',
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
    title: 'Womegle – Free Online Chat, Random Video Calls & Voice Chat India',
    description: 'Connect instantly with strangers across India via 1-on-1 random video calls, voice chats & text messaging. Gender preference matching & 8 Indian languages.',
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
    title: 'Womegle – Free Online Chat, Random Video Calls & Voice Chat India',
    description: 'Connect 1-on-1 with strangers across India via online video calls, voice chats & text messaging.',
    images: ['https://womegle.in/icon.png'],
  },
  other: {
    'geo.region': 'IN',
    'geo.placename': 'India',
    'content-language': 'en-IN, hi-IN',
  },
};

const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Womegle',
  alternateName: ['Womegle India', 'Womegle.in', 'Omegle Alternative India', 'Indian Random Video Chat'],
  url: 'https://womegle.in',
};

const jsonLdSoftware = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Womegle',
  url: 'https://womegle.in',
  description: 'Free anonymous 1-on-1 online chat, online video calls, and online voice chats for India.',
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

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Womegle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Womegle (womegle.in) is India\'s premier free anonymous 1-on-1 online chat, random video call, and voice chat platform with zero registration.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is online video call and text chat free on Womegle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Womegle is 100% free with unlimited text messaging, HD WebRTC video calls, and crystal-clear voice chats.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which Indian languages are supported on Womegle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Womegle supports 8 Indian languages: Hindi, English, Hinglish, Tamil, Telugu, Kannada, Malayalam, and Marathi.',
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FVXFDWGYM9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FVXFDWGYM9');
          `}
        </Script>
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

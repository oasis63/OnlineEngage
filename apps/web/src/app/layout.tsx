import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'AnonChat - Anonymous Random Chat India',
  description: 'Production-quality anonymous random chat platform inspired by Omegle, built for India with multi-language and interest-based matching.',
  keywords: ['AnonChat', 'Omegle Alternative India', 'Anonymous Video Chat', 'Random Chat India', 'Hindi Video Chat'],
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

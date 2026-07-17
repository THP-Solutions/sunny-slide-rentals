import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import { LanguageProvider } from '@/contexts/LanguageContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Sunny Slide Rentals | Cape Coral, Lehigh Acres & Fort Myers, FL',
    template: '%s | Sunny Slide Rentals',
  },
  description:
    'Water slides, bounce houses & party rentals delivered across Cape Coral, Lehigh Acres, Fort Myers and Southwest Florida. Full delivery & setup included!',
  openGraph: {
    title: 'Sunny Slide Rentals | Water Slides & Party Rentals — SW Florida',
    description: 'Book water slides, combo units & party packages for Cape Coral, Fort Myers & surrounding areas. Full delivery & setup included!',
    url: 'https://sunnysliderentals.com',
    siteName: 'Sunny Slide Rentals',
    images: [
      {
        url: '/images/freedom-fury.jpeg',
        width: 1200,
        height: 630,
        alt: "Freedom's Fury — Sunny Slide Rentals",
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunny Slide Rentals | Water Slides & Party Rentals — SW Florida',
    description: 'Book water slides, combo units & party packages. Full delivery & setup included!',
    images: ['/images/freedom-fury.jpeg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <Navbar />
          {children}
          <Footer />
          <ChatBot />
        </LanguageProvider>
      </body>
    </html>
  );
}

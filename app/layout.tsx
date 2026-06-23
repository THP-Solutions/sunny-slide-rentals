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

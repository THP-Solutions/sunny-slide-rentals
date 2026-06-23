import type { Metadata } from 'next';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about Sunny Slide Rentals — delivery, setup, deposits, weather policy, and more.',
};

export default function FAQPage() {
  return <FAQClient />;
}

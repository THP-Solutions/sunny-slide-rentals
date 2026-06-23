import type { Metadata } from 'next';
import RentalsClient from './RentalsClient';

export const metadata: Metadata = {
  title: 'Rentals',
  description:
    'Browse our full inventory of water slides, bounce houses, combo units, and party packages available in Cape Coral, Lehigh Acres & Fort Myers, FL.',
};

export default function RentalsPage() {
  return <RentalsClient />;
}

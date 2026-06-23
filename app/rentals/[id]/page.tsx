import { notFound } from 'next/navigation';
import { getRentalById, RENTALS } from '@/lib/rentals';
import type { Rental } from '@/lib/rentals';
import RentalDetail from './RentalDetail';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return RENTALS.map((r) => ({ id: r.id }));
}

export function generateMetadata({ params }: Props) {
  const rental = getRentalById(params.id);
  if (!rental) return { title: 'Not Found' };
  return {
    title: rental.name,
    description: rental.description,
  };
}

export default function RentalPage({ params }: Props) {
  const rental = getRentalById(params.id);
  if (!rental) notFound();

  const sameCat = RENTALS.filter(
    (r) => r.id !== rental!.id && r.category === rental!.category,
  ).slice(0, 2);

  const related: Rental[] = [...sameCat];
  if (related.length < 2) {
    RENTALS.filter((r) => r.id !== rental!.id && r.category !== rental!.category)
      .slice(0, 2 - related.length)
      .forEach((r) => related.push(r));
  }

  return <RentalDetail rental={rental!} relatedRentals={related} />;
}

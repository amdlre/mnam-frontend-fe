import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Plus } from 'lucide-react';
import { Button } from '@amdlre/design-system';

import { fetchBookingsPaginated } from '@/lib/api/dashboard/entities';
import { HeaderInfo } from '@/components/dashboard/shared/header-info';
import { BookingsTable } from '@/components/dashboard/features/bookings/bookings-table';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardBookingsPage({ params }: Props) {
  const { locale } = await params;
  // Fetch a large page; the EntityTable paginates client-side from URL params.
  const [t, result] = await Promise.all([
    getTranslations('dashboard.bookings'),
    fetchBookingsPaginated(1, 500),
  ]);

  return (
    <div className="space-y-6">
      <HeaderInfo
        title={t('title')}
        subtitle={t('subtitle', { total: result.total })}
        actions={
          <Button
            href="/dashboard/bookings/new"
            locale={locale}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            {t('add')}
          </Button>
        }
      />

      <BookingsTable bookings={result.items} />
    </div>
  );
}

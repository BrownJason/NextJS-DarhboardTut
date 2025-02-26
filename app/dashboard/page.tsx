import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '../ui/skeletons';
import { Metadata } from 'next';
import PaidVsPendingChart from '../ui/dashboard/paid-vs-pend-chart';
import InvoiceByCustomer from '../ui/dashboard/invoice-by-customer';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page(props: {
  searchParams?: Promise<{
    year?: number;
  }>;
}) {
  const searchParams = await props.searchParams;
  const yearToUse = Number(searchParams?.year) || 2022;
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart year={yearToUse} />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense>
          <PaidVsPendingChart />
        </Suspense>
        <Suspense>
          <InvoiceByCustomer />
        </Suspense>
      </div>
    </main>
  );
}

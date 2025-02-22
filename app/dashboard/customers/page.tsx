import Table from '@/app/ui/customers/table';
import { Suspense } from 'react';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';
import Search from '@/app/ui/search';
import { CreateCustomer } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const customers = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Customers</h1>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <CreateCustomer />
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense key={query}>
          <Table customers={customers} />
        </Suspense>
      </div>
    </div>
  );
}

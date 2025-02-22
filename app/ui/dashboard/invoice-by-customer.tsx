import { lusitana } from '@/app/ui/fonts';
import { fetchInvoiceByCustomer } from '@/app/lib/data';
import 'chart.js/auto';
import PolarAreaChart from './PolarAreaChart';
import { unstable_cache } from 'next/cache';

const getCachedInvoiceByCustomer = unstable_cache(async () => fetchInvoiceByCustomer(), ['invoice_by_customer'], { revalidate: 4000 });

export default async function InvoiceByCustomer() {
  const invoicesByCustomer = await getCachedInvoiceByCustomer();

  if (!invoicesByCustomer || invoicesByCustomer.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Invoice Amounts by Customer</h2>
      <PolarAreaChart data={invoicesByCustomer} />
    </div>
  );
}

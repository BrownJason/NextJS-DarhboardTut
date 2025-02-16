import { lusitana } from '@/app/ui/fonts';
import { fetchAllInvoices } from '@/app/lib/data';
import 'chart.js/auto';
import PieChart from './PieChart';

export default async function PaidVsPendingChart() {
  const invoices = await fetchAllInvoices();

  if (!invoices || invoices.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Collected vs Pending</h2>
      <PieChart data={invoices} />
    </div>
  );
}

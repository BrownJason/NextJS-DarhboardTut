import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';
import 'chart.js/auto';
import LineChart from './LineChart';
import { unstable_cache } from 'next/cache';

const getCachedRevenue = unstable_cache(async () => fetchRevenue(), ['revenue'], { revalidate: 4000 });

export default async function RevenueChart(year: { year: number }) {
  const revenue = await getCachedRevenue();
  const yearToUse = year.year;

  const years = revenue
    .map((year) => {
      return year.year;
    })
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort((yearA, yearB) => yearA - yearB);

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let monthsUsed: string[] = [];
  let revenueToUse: { month: string; revenue: number; year: number }[] = [];

  revenue
    .filter((value) => value.year === yearToUse)
    .forEach(({ month, revenue }) => {
      monthsUsed.push(month);
      revenueToUse.push({ month, revenue, year: yearToUse });
    });

  months.forEach((month) => {
    if (!monthsUsed.includes(month)) {
      revenueToUse.push({ month, revenue: 0, year: yearToUse });
    }
  });

  const revenueResults = revenueToUse.sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month)).map((res) => res.revenue);

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Recent Revenue</h2>
      <LineChart data={revenueResults} years={years} year={yearToUse} />
    </div>
  );
}

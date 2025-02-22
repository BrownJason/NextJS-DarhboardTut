'use client';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import 'chart.js/auto';
import { Chart, registerables } from 'chart.js/auto';

Chart.register(...registerables);

const LineChart = (props: { data: any[]; years: number[]; year: number }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleOnChange = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('year', term);
    replace(`${pathname}?${params.toString()}`);
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Revenue Paid',
        data: props.data,
        fill: false,
        borderColor: 'rgb(125, 0, 251)',
        borderWidth: 1,
        backgroundColor: 'rgb(125, 0, 251)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        grid: {
          color: 'rgb(36, 32, 32)',
          lineWidth: 2,
        },
        ticks: {
          backdropColor: 'rgb(36, 32, 32)',
        },
        border: {
          color: 'rgb(36, 32, 32)',
          width: 2,
        },
      },
      y: {
        grid: {
          color: 'rgb(36, 32, 32)',
          lineWidth: 2,
        },
        ticks: {
          backdropColor: 'rgb(36, 32, 32)',
        },
        border: {
          color: 'rgb(36, 32, 32)',
          width: 2,
        },
      },
    },
  };

  return (
    <div className="dark:text-white">
      <div className="text-right align-middle">
        Revenue By Year:{' '}
        <select onChange={(e) => handleOnChange(e.target.value)} className="dark:bg-gray-600 font-size-50" defaultValue={searchParams.get('year')?.toString()}>
          {props.years?.map((years) => {
            return (
              <option value={years} key={years}>
                {years}
              </option>
            );
          })}
          ;
        </select>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};
export default LineChart;

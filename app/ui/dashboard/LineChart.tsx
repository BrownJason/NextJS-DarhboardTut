'use client';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { Chart, registerables } from 'chart.js/auto';

Chart.register(...registerables);

const LineChart = (props: { data: any[] }) => {
  const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
  });

  const months = props.data.map((months) => {
    return months.month;
  });

  const revenue = props.data.map((revenues) => {
    return revenues.revenue;
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Revenue',
        data: revenue,
        fill: false,
        borderColor: 'rgb(125, 0, 251)',
        borderWidth: 1,
        backgroundColor: 'rgb(125, 0, 251)',
      },
    ],
  };

  const options = {
    responsive: true,
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
      <Line data={data} options={options} />
    </div>
  );
};
export default LineChart;

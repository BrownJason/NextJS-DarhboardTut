'use client';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { Chart, registerables } from 'chart.js/auto';
import { Colors } from 'chart.js';

Chart.register(Colors);
Chart.register(...registerables);

const PolarAreaChart = (props: { data: any[] }) => {
  const customer = props.data.map((customer) => {
    return customer.name;
  });

  const revenue = props.data.map((a) => {
    return a.amount;
  });

  const data = {
    labels: customer,
    datasets: [
      {
        label: 'Invoice Amount',
        data: revenue,
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 1,
        backgroundColor: ['#8fd7d7', '#00b0be', '#ff8ca1', '#f45f74', '#bdd373', '#98c127'],
      },
    ],
  };

  const PolarArea = dynamic(() => import('react-chartjs-2').then((mod) => mod.PolarArea), {
    ssr: false,
  });

  const options = {
    scales: {
      r: {
        grid: {
          color: 'rgb(36, 32, 32)',
          lineWidth: 2,
          circular: true,
        },
        ticks: {
          backdropColor: 'rgb(36, 32, 32)',
          color: 'rgb(255,255,255)',
          z: 1,
        },
      },
    },
  };
  return <PolarArea data={data} options={options} />;
};
export default PolarAreaChart;

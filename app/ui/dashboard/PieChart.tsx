'use client';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { Chart, registerables } from 'chart.js/auto';
import { cache } from 'react';

Chart.register(...registerables);

const PieChart = (props: { data: any[] }) => {
  const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), {
    ssr: false,
  });

  const revenue = props.data.map((a) => {
    return a.amount;
  });

  const data = {
    labels: ['Pending', 'Paid'],
    datasets: [
      {
        data: revenue,
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 1,
        backgroundColor: ['rgba(233, 0, 0, 0.7)', 'rgba(0, 255, 30, 0.7)'],
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChart;

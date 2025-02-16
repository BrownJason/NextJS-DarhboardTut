'use client';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { Chart, registerables } from 'chart.js/auto';

Chart.register(...registerables);

const PieChart = (props: { data: any[] }) => {
  const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), {
    ssr: false,
  });
  const status = props.data.map((status) => {
    return status.status;
  });

  const revenue = props.data.map((a) => {
    return a.amount;
  });

  const data = {
    labels: status,
    datasets: [
      {
        label: 'Monthly Revenue',
        data: revenue,
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 1,
        backgroundColor: ['rgba(233, 0, 0, 0.7)', 'rgba(0, 255, 30, 0.7)'],
      },
    ],
  };

  const options = {
    responsive: true,
  };

  return <Pie data={data} options={options} />;
};
export default PieChart;

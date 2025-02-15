'use client';
import dynamic from 'next/dynamic';
import 'chart.js/auto';

const LineChart = (props: { data: any[] }) => {
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
        borderColor: 'rgb(64, 0, 138)',
        borderWidth: 1,
        backgroundColor: ['rgba(255, 99, 132, 0.4)', 'rgba(255, 159, 64, 0.4)', 'rgba(255, 205, 86, 0.4)', 'rgba(75, 192, 192, 0.4)', 'rgba(54, 162, 235, 0.4)', 'rgba(153, 102, 255, 0.4)', 'rgba(41, 43, 207, 0.4)', 'rgba(54, 102, 205, 0.4)', 'rgba(153, 102, 15, 0.4)', 'rgba(241, 143, 207, 0.4)', 'rgba(8, 158, 41, 0.4)', 'rgba(199, 11, 36, 0.4)'],
        animations: {
          tension: {
            duration: 1000,
            easing: 'easeOutQuint',
            from: 1,
            to: 0,
            loop: true,
          },
        },
      },
    ],
  };

  const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
  });
  return (
    <>
      <Line data={data} />
    </>
  );
};
export default LineChart;

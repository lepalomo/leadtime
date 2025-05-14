import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

interface LeadtimeChartProps {
  shouldAnimate: boolean;
}

const LeadtimeChart = ({ shouldAnimate }: LeadtimeChartProps) => {
  const data = {
    labels: Array.from({ length: 15 }, (_, i) => `Pedido ${i + 1}`),
    datasets: [
      {
        label: 'Leadtime (minutos)',
        data: [
          74, 60, 67, // Pizzaria A - média mais alta
          57, 69, 63, // Pizzaria B - foco em entrega
          73, 58, 66, // Pizzaria C - mais irregular
          61, 71, 62, // Mix de pedidos
          68, 59, 65  // Mix de pedidos
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Média (65 min)',
        type: 'line' as const,
        data: Array(15).fill(65),
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
      }
    ],
  };

  const options = {
    responsive: true,
    animation: shouldAnimate ? {} : false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tempo (minutos)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Leadtime por Pedido',
      },
      tooltip: {
        callbacks: {
          label: (context: { dataset: { label?: string }; raw: unknown }) => {
            const label = context.dataset.label || '';
            const value = context.raw as number;
            return `${label}: ${value} minutos`;
          }
        }
      }
    },
  };

  return <Bar
    data={data as ChartData<'bar', number[], string>}
    options={options}
  />;
};

export default LeadtimeChart;
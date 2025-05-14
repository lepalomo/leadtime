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
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CycletimesChartProps {
  shouldAnimate: boolean;
}

const CycletimesChart = ({ shouldAnimate }: CycletimesChartProps) => {
  const data = {
    labels: Array.from({length: 15}, (_, i) => `Pedido ${i+1}`),
    datasets: [
      {
        label: 'Preparo (e embalagem)',
        data: Array(15).fill(0).map(() => 28 + Math.random() * 8),
        backgroundColor: 'rgba(220, 53, 69, 0.7)'
      },
      {
        label: 'Entrega',
        data: Array(15).fill(0).map(() => 10 + Math.random() * 7),
        backgroundColor: 'rgba(255, 193, 7, 0.7)'
      }
    ]
  };

  const options = {
    responsive: true,
    animation: shouldAnimate ? {} : false,
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Tempo (minutos)'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Tempo por Fase Consolidada'
      },
      tooltip: {
        callbacks: {
          afterBody: (context: any[]) => {
            const total = context.reduce((a: number, b: {raw: number}) => a + b.raw, 0);
            return `Total: ${total.toFixed(1)} minutos`;
          }
        }
      }
    }
  };

  return <Bar 
    data={data as ChartData<'bar', number[], string>}
    options={options}
  />;
};

export default CycletimesChart;
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';


interface PhaseTimes {
  waitingPreparation: number;
  preparation: number;
  waitingPackaging: number;
  packaging: number;
  waitingDelivery: number;
  delivery: number;
  averageTotal: number;
}

interface LeadtimeBreakdownChartProps {
  shouldAnimate: boolean;
  phaseTimes?: PhaseTimes;
}

const defaultPhaseTimes: PhaseTimes = {
  waitingPreparation: 20,
  preparation: 15,
  waitingPackaging: 5,
  packaging: 2,
  waitingDelivery: 4,
  delivery: 11,
  averageTotal: 65
};

const LeadtimeBreakdownChart = ({ shouldAnimate, phaseTimes = defaultPhaseTimes }: LeadtimeBreakdownChartProps) => {
  const data = {
    labels: Array.from({length: 25}, (_, i) => `Pedido ${i+1}`),
    datasets: [
      {
        label: 'Aguardando preparo',
        data: Array(25).fill(0).map(() => phaseTimes.waitingPreparation + Math.random() * 4),
        backgroundColor: 'rgba(255, 99, 132, 0.7)'
      },
      {
        label: 'Em preparo',
        data: Array(25).fill(0).map(() => phaseTimes.preparation + Math.random() * 3),
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
      },
      {
        label: 'Aguardando embalagem',
        data: Array(25).fill(0).map(() => phaseTimes.waitingPackaging + Math.random() * 2),
        backgroundColor: 'rgba(255, 206, 86, 0.7)'
      },
      {
        label: 'Em embalagem',
        data: Array(25).fill(0).map(() => phaseTimes.packaging + Math.random() * 2),
        backgroundColor: 'rgba(75, 192, 192, 0.7)'
      },
      {
        label: 'Aguardando entrega',
        data: Array(25).fill(0).map(() => phaseTimes.waitingDelivery + Math.random() * 3),
        backgroundColor: 'rgba(153, 102, 255, 0.7)'
      },
      {
        label: 'Efetuando entrega',
        data: Array(25).fill(0).map(() => phaseTimes.delivery + Math.random() * 4),
        backgroundColor: 'rgba(255, 159, 64, 0.7)'
      },
      {
        label: 'Média (65 min)',
        type: 'line' as const,
        data: Array(25).fill(phaseTimes.averageTotal),
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false
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
        text: 'Tempo por Fase do Pedido'
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

export default LeadtimeBreakdownChart;
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

interface ThroughputChartProps {
  shouldAnimate: boolean;
}

const ThroughputChart = ({ shouldAnimate }: ThroughputChartProps) => {
  // Gerar dados para os últimos 30 dias
  const generateData = () => {
    const days = [];
    const throughput = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayOfWeek = date.getDay(); // 0=Domingo, 1=Segunda, etc
      const dayOfMonth = date.getDate();
      
      days.push({
        dayOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][dayOfWeek],
        dayOfMonth
      });
      
      // Gerar throughput baseado no dia da semana
      let baseAmount;
      switch(dayOfWeek) {
        case 1: // Segunda
          baseAmount = 30;
          break;
        case 2: // Terça - fechado
          baseAmount = 0;
          break;
        case 3: // Quarta
          baseAmount = 25 + Math.random() * 20;
          break;
        case 4: // Quinta
          baseAmount = 45 + Math.random() * 20;
          break;
        case 5: // Sexta
          baseAmount = 70 + Math.random() * 20;
          break;
        case 6: // Sábado
          baseAmount = 80 + Math.random() * 30;
          break;
        case 0: // Domingo
          baseAmount = 80 + Math.random() * 30;
          break;
        default:
          baseAmount = 0;
      }
      
      throughput.push(Math.round(baseAmount));
    }
    
    return { days, throughput };
  };

  const { days, throughput } = generateData();

  const data = {
    labels: days.map(d => d.dayOfWeek),
    datasets: [
      {
        label: 'Pizzas entregues',
        data: throughput,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    animation: shouldAnimate ? {} : false,
    scales: {
      x: {
        ticks: {
          callback: function(this: any, tickValue: string | number, index: number) {
              // Mostrar dia da semana em cima e dia do mês embaixo
              return `${days[index].dayOfWeek}\n${days[index].dayOfMonth}`;
            }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Pizzas entregues',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Throughput Diário (últimos 30 dias)',
      },
    },
  };

  return <Bar
    data={data as ChartData<'bar', number[], string>}
    options={options}
  />;
};

export default ThroughputChart;
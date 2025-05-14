import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DayData {
  dayOfWeek: string;
  dayOfMonth: string;
  throughput: number;
}

const generateData = () => {
  const days: DayData[] = [];
  const throughput: number[] = [];
  
  // Gerar dados para 30 dias
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - 30 + i);
    const dayOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][date.getDay()];
    const dayOfMonth = date.getDate().toString();
    
    let pizzas = 0;
    if (dayOfWeek === 'Ter') {
      pizzas = 0; // Terça fechado
    } else if (dayOfWeek === 'Qua') {
      pizzas = 25 + Math.floor(Math.random() * 10);
    } else if (dayOfWeek === 'Qui') {
      pizzas = 45 + Math.floor(Math.random() * 10);
    } else if (dayOfWeek === 'Sex') {
      pizzas = 70 + Math.floor(Math.random() * 15);
    } else if (dayOfWeek === 'Sab' || dayOfWeek === 'Dom') {
      pizzas = 80 + Math.floor(Math.random() * 20);
    } else if (dayOfWeek === 'Seg') {
      pizzas = 30 + Math.floor(Math.random() * 10);
    }
    
    days.push({ dayOfWeek, dayOfMonth, throughput: pizzas });
    throughput.push(pizzas);
  }
  
  return { days, throughput };
};

interface Props {
  shouldAnimate?: boolean;
}

const ThroughputByBordaChart: React.FC<Props> = ({ shouldAnimate }) => {
  const { days, throughput } = generateData();

  const data = {
    labels: days.map(d => d.dayOfWeek),
    datasets: [
      {
        label: 'Borda recheada',
        data: throughput.map((total, i) => {
          const day = days[i].dayOfWeek;
          return day === 'Seg' ? Math.round(total * 0.7) : Math.round(total * 0.3);
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Borda normal',
        data: throughput.map((total, i) => {
          const day = days[i].dayOfWeek;
          return day === 'Seg' ? Math.round(total * 0.3) : Math.round(total * 0.7);
        }),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: shouldAnimate ? 1000 : 0,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Pizzas por tipo de borda',
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: function(this: any, tickValue: string | number, index: number) {
            return `${days[index].dayOfWeek}\n${days[index].dayOfMonth}`;
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Pizzas entregues',
        },
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default ThroughputByBordaChart;
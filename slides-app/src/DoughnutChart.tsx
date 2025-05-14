import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  Plugin
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface DoughnutChartProps {
  shouldAnimate: boolean;
  preparationTime?: number;
  deliveryTime?: number;
  title?: string;
}

const PieChart = ({ shouldAnimate, preparationTime = 45, deliveryTime = 20, title }: DoughnutChartProps) => {
  const average = Math.floor(Math.random() * 5) + 63; // Random between 63-67
  
  // Custom plugin for center text
  const centerTextPlugin: Plugin<'pie'> = {
    id: 'centerText',
    afterDraw(chart) {
      const { ctx } = chart;
      const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

      ctx.save();
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${average} min avg`, centerX, centerY);
      ctx.restore();
    }
  };

  const data = {
    labels: ['Preparo', 'Entrega'],
    datasets: [{
      data: [preparationTime, deliveryTime],
      backgroundColor: [
        'rgba(220, 53, 69, 0.7)', // Tomato sauce red
        'rgba(255, 193, 7, 0.7)'  // Cheese yellow
      ],
      borderColor: [
        'rgba(220, 53, 69, .7)',
        'rgba(255, 193, 7, .7)'
      ],
      borderWidth: 1,
    }]
  };

  const options = {
    responsive: true,
    animation: shouldAnimate ? {} : false,
    cutout: 0,
    plugins: {
      legend: {
        display: true
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw as number;
            return `${context.label}: ${value} %`;
          }
        }
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {title && <h4 style={{ marginBottom: '10px' }}>{title}</h4>}
      <Pie
        data={data as ChartData<'pie', number[], string>}
        options={options}
        plugins={[centerTextPlugin]}
      />
    </div>
  );
};

export default PieChart;
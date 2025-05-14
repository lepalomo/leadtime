import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { callback } from 'chart.js/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimeData {
  date: string;
  values: number[];
}

// Fases em ordem inversa (última fase embaixo)
const phases = [
  'Efetuando entrega',
  'Aguardando entrega',
  'Em embalagem', 
  'Aguardando embalagem',
  'Em preparo',
  'Aguardando preparo'
];

const hours = ['19:00h', '|', '|', '|', '20:00h', '|', '|', '|', '21:00h', '|', '|', '|', '22:00h', '|', '|', '|', '23:00h', '|', '|', '|', '00:00h', '|', '|', '|'];
const generateData = (): TimeData[] => {
  const data: TimeData[] = [];
  const daysOfWeek = [3, 4, 5, 6, 0, 1]; // Quarta a Domingo (segunda = 1)
  
  // Inicializar contagens cumulativas
  let cumulativeCounts = Array(phases.length).fill(0);

  daysOfWeek.forEach(day => {
    hours.forEach(hour => {
      // Definir volume baseado no horário (pico 21h-22h)
      let newItems = 0;
      const hourNum = parseInt(hour);
      if (hourNum >= 20 && hourNum <= 23) {
        newItems = 8 + Math.floor(Math.random() * 5); // 8-12 no pico
      } else {
        newItems = 2 + Math.floor(Math.random() * 4); // 2-5 fora do pico
      }

      // Adicionar novos itens na primeira fase
      cumulativeCounts[phases.length - 1] += newItems;

      // Mover itens entre fases (mantendo contagem cumulativa)
      for (let j = phases.length - 1; j > 0; j--) {
        if (cumulativeCounts[j] > 0) {
          const moving = Math.min(
            Math.floor(cumulativeCounts[j] * 0.7), // 40% dos itens avançam
            cumulativeCounts[j]
          );
          cumulativeCounts[j] -= moving;
          cumulativeCounts[j - 1] += moving;
        }
      }

      // Balancear valores finais para terminar no mesmo ponto
      if (hour === '23h') {
        const total = cumulativeCounts.reduce((a, b) => a + b, 0);
        cumulativeCounts = cumulativeCounts.map((_, i) =>
          i === 0 ? total : 0 // Todos itens na última fase
        );
      }

      const timeData = {
        date: `${['Qua', 'Qui', 'Sex', 'Sáb', 'Dom', 'Seg'][daysOfWeek.indexOf(day)]} ${hour}`,
        values: [...cumulativeCounts]
      };
      data.push(timeData);
    });
  });

  return data;
};

const CumulativeFlowChart = () => {
  const chartData = generateData();
  
  const data = {
    labels: chartData.map(d => d.date),
    datasets: phases.map((phase, idx) => ({
      label: phase,
      data: chartData.map(d => d.values[idx]),
      backgroundColor: [
        'rgb(0, 100, 18)',
        'rgb(23, 165, 42)',
        'rgb(255, 51, 0)',
        'rgb(255, 123, 0)',
        'rgb(255, 174, 0)',
        'rgb(255, 232, 100)'
      ][idx],
      borderWidth: 0,
      fill: true,
      pointRadius: 1,
    }))
  };  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Fluxo Cumulativo (Semana - 19h-00h)',
        padding: {
          top: 10,
          bottom: 30
        },
        font: {
          size: 16
        }
      },
      legend: {
        position: 'top' as const,
        align: 'center' as const,
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
          drawBorder: false
        },
        ticks: {
          display: false,
          autoSkip: false,
          maxTicksLimit: 400,
          stepSize: 1,
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Quantidade de Itens',
          font: {
            size: 12
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Hora',
          font: {
            size: 12
          }
        },
        ticks: {
          autoSkip: false,
          font: {
            size: 10
          },
          callback: function(value: string | number, index: number, values: any[]) {
            // Mostrar dia + hora no primeiro ponto de cada dia (19:00)
            if (index % 24 === 0) {
              return chartData[index].date;
            }
            // Mostrar apenas hora nos pontos subsequentes
            if (index % 4 === 0) {
              return hours[index % 24];
            }
            return '';
          }
        }
      }
    }
  };  return (
    <div className="chart-wrapper" style={{ margin:"0px", width: "1300px", height: "750px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default CumulativeFlowChart;
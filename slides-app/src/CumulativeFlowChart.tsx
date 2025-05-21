import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
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


// --- CONFIGURAÇ
// ÕES AJUSTÁVEIS ---
const OPEN_HOUR = 19;
const CLOSE_HOUR = 23;
const MEAN_LEAD_TIME = 40; // minutos
const LEAD_TIME_VARIANCE = 8; // minutos
const DAILY_DEMAND = [0.5, 0.7, 1.0, 1.3, 1.7, 2.0, 2.2]; // seg a dom
const HOURLY_DEMAND = [
  0.08, // 19h-20h
  0.15, // 20h-21h
  0.22, // 21h-22h
  0.18, // 22h-23h
  0.10, // 23h-00h
];
const MEAN_ORDERS_PER_DAY = 60;
const SAMPLE_INTERVAL = 10; // minutos

// Gera slots de tempo (ex: 19:00, 19:10, ... 23:50, 00:00)
function generateTimeSlots() {
  const slots: string[] = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    for (let m = 0; m < 60; m += SAMPLE_INTERVAL) {
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  slots.push('00:00');
  return slots;
}

// Gera pedidos do dia, cada um com slot de entrada e lead time aleatório
function generateOrdersForDay(dayOfWeek: number) {
  const demandFactor = DAILY_DEMAND[dayOfWeek];
  const totalOrders = Math.round(MEAN_ORDERS_PER_DAY * demandFactor * (0.9 + Math.random() * 0.2));
  const orders: { entry: number; leadTime: number }[] = [];
  const slotsPerHour = 60 / SAMPLE_INTERVAL;
  let orderCount = 0;
  for (let h = 0; h < HOURLY_DEMAND.length; h++) {
    const hourOrders = Math.round(totalOrders * HOURLY_DEMAND[h]);
    for (let i = 0; i < hourOrders; i++) {
      const minute = Math.floor(Math.random() * 60);
      const entry = (h * slotsPerHour) + Math.floor(minute / SAMPLE_INTERVAL);
      const leadTime = MEAN_LEAD_TIME + Math.round((Math.random() - 0.5) * 2 * LEAD_TIME_VARIANCE);
      orders.push({ entry, leadTime });
      orderCount++;
    }
  }
  orders.sort((a, b) => a.entry - b.entry);
  return orders;
}

// Gera os dados cumulativos para o gráfico (cada fase = total de pedidos que já passaram por ela)
function generateCumulativeData(): TimeData[] {
  const daysOfWeek = [3, 4, 5, 6, 0, 1]; // Quarta a Segunda
  const slots = generateTimeSlots();
  const data: TimeData[] = [];
  const phaseCount = phases.length;

  // Para cada dia, gerar os pedidos e registrar passagem por cada fase
  // cumulativeByPhase[i] = total acumulado de pedidos que já passaram pela fase i até o momento
  let cumulativeByPhase = Array(phaseCount).fill(0);
  // Para cada slot, precisamos saber quantos pedidos passaram por cada fase até aquele momento
  // Para isso, vamos manter um array de "passagens" por fase para cada slot

  // Para cada dia
  daysOfWeek.forEach((day, dayIdx) => {
    const orders = generateOrdersForDay(day);
    // Para cada slot de tempo
    for (let slotIdx = 0; slotIdx < slots.length; slotIdx++) {
      // Descobre a hora do slot atual
      const slotHour = parseInt(slots[slotIdx].split(':')[0], 10);
      // Para cada fase, contar quantos pedidos entram nela neste slot
      let phaseEntries = Array(phaseCount).fill(0);
      orders.forEach(order => {
        const start = order.entry;
        const end = order.entry + Math.ceil(order.leadTime / SAMPLE_INTERVAL);
        // A partir das 23h, não entram novos pedidos (não incrementa mais aguardando preparo)
        if (slotHour < 23 && slotIdx === start) {
          phaseEntries[phaseCount - 1]++;
        }
        // Para cada fase, calcular o momento em que o pedido entra nela
        for (let p = phaseCount - 2; p >= 0; p--) {
          // O tempo de cada fase é proporcional
          const phaseStart = start + Math.floor(((phaseCount - 1 - p) * (end - start)) / phaseCount);
          if (slotIdx === phaseStart && slotIdx > start && slotIdx <= end) {
            phaseEntries[p]++;
          }
        }
      });
      // Atualiza o acumulado de cada fase
      for (let p = 0; p < phaseCount; p++) {
        cumulativeByPhase[p] += phaseEntries[p];
      }
      // Às 00:00, todas as fases se encontram (igualam ao maior valor)
      let values = [...cumulativeByPhase];
      if (slots[slotIdx] === '00:00') {
        const maxVal = Math.max(...cumulativeByPhase);
        values = Array(phaseCount).fill(maxVal);
        // Atualiza o acumulado para o próximo dia
        cumulativeByPhase = Array(phaseCount).fill(maxVal);
      }
      data.push({
        date: `${['Qua', 'Qui', 'Sex', 'Sáb', 'Dom', 'Seg'][dayIdx]} ${slots[slotIdx]}`,
        values
      });
    }
  });
  return data;
}

const generateData = generateCumulativeData;

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
  };

  const options = {
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
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
        limits: {
          x: { min: 0 },
          y: { min: 0 },
        },
      }
    },
    scales: {
      y: {
        stacked: false,
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
          callback: function(value: string | number, index: number, ticks: any[]) {
            // Atualiza os labels do eixo X conforme o zoom/pan
            // slots.length = 24 (das 19:00 até 23:50, de 10 em 10 min) + 1 (00:00)
            // slotsPerDay = (CLOSE_HOUR - OPEN_HOUR) * (60 / SAMPLE_INTERVAL) + 1
            const slotsPerDay = (CLOSE_HOUR - OPEN_HOUR) * (60 / SAMPLE_INTERVAL) + 1;
            // Se for o primeiro tick visível de cada dia, mostra o label completo
            if (index % slotsPerDay === 0) {
              return chartData[index]?.date || '';
            }
            // Mostrar apenas hora cheia nos pontos subsequentes
            const slotsPerHour = 60 / SAMPLE_INTERVAL;
            const slotIdx = index % slotsPerDay;
            if (slotIdx % slotsPerHour === 0) {
              const hour = OPEN_HOUR + Math.floor(slotIdx / slotsPerHour);
              return `${hour.toString().padStart(2, '0')}:00h`;
            }
            return '';
          }
        }
      }
    },
  };
  return (
    <div className="chart-wrapper" style={{ margin:"0px", width: "1300px", height: "750px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default CumulativeFlowChart;
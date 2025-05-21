import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import cfdData from './data/cfd_data_realistic_adjusted.json';
import zoomPlugin from 'chartjs-plugin-zoom';

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

// Fases em ordem inversa (última fase embaixo)
const phases = [
  'Pedido Entregue',
  'Aguardando entrega', 
  'Em embalagem',
  'Aguardando embalagem',
  'Em preparo',
  'Aguardando preparo'
];

interface TimeData {
  date: string;
  values: number[];
}

const parseData = (): TimeData[] => {
  const data: TimeData[] = [];
  const allEntries = cfdData as string[][];
  // Extrai todos os timestamps únicos e ordena
  const allTimestamps = Array.from(
    new Set(allEntries.flatMap(entry => entry))
  ).sort();

  // Normaliza todos os timestamps para precisão de minuto UTC
  function toMinuteUTC(dateStr: string) {
    const d = new Date(dateStr);
    d.setUTCSeconds(0, 0);
    return d.toISOString();
  }
  const normalizedTimestamps = Array.from(new Set(allTimestamps.map(toMinuteUTC))).sort();

  normalizedTimestamps.forEach(timestamp => {
    const cumulativeCounts = phases.map((_, phaseIdx) => {
      return allEntries.filter(entry => {
        const phaseTime = entry[phases.length - 1 - phaseIdx];
        return phaseTime && toMinuteUTC(phaseTime) <= timestamp;
      }).length;
    });
    data.push({
      date: timestamp,
      values: cumulativeCounts
    });
  });
  return data;
};

const CfdChart = () => {
  const chartData = parseData();

  // Gera labels lineares de minuto em minuto apenas para o dia 17/05/2025 (UTC)
  const start = new Date('2025-05-16T00:00:00.000Z');
  const end = new Date('2025-05-17T23:59:00.000Z');
  const linearLabels: string[] = [];
  let d = new Date(start);
  while (d <= end) {
    linearLabels.push(d.toISOString());
    d = new Date(d.getTime() + 60 * 1000); // Avança 1 minuto
  }

  // Preenche os dados para cada label linear, usando forward fill APÓS o primeiro dado real
  function isSameMinute(a: string, b: string) {
    // Compara ano, mês, dia, hora e minuto
    const da = new Date(a);
    const db = new Date(b);
    return da.getUTCFullYear() === db.getUTCFullYear() &&
      da.getUTCMonth() === db.getUTCMonth() &&
      da.getUTCDate() === db.getUTCDate() &&
      da.getUTCHours() === db.getUTCHours() &&
      da.getUTCMinutes() === db.getUTCMinutes();
  }

  let lastValues: number[] = Array(phases.length).fill(0);
  let foundFirst = false;
  const linearData = linearLabels.map(label => {
    const found = chartData.find(d => isSameMinute(d.date, label));
    if (found) {
      lastValues = found.values;
      foundFirst = true;
      return found.values;
    } else if (foundFirst) {
      return lastValues;
    } else {
      return Array(phases.length).fill(0);
    }
  });

  const data = {
    labels: linearLabels,
    datasets: phases.map((phase, idx) => ({
      label: phase,
      data: linearData.map(values => values[idx]),
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
      zoom: {
        pan: {
          enabled: true,
          mode: 'y' as const,
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: false,
          },
          mode: 'xy' as const,
        },
        limits: {
          x: { minRange: 1 },
          y: { minRange: 1 },
        },
      },
      title: {
        display: true,
        text: 'Fluxo Cumulativo',
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
      tooltip: {
        callbacks: {
          title: function(context: any) {
            // context[0].label é o timestamp ISO
            if (!context.length) return '';
            const label = context[0].label;
            if (!label) return '';
            const d = new Date(label);
            if (isNaN(d.getTime())) return label;
            // Formato: 'dd/MM HH:mm'
            const dia = String(d.getUTCDate()).padStart(2, '0');
            const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
            const hora = String(d.getUTCHours()).padStart(2, '0');
            const min = String(d.getUTCMinutes()).padStart(2, '0');
            return `${dia}/${mes} ${hora}:${min}`;
          }
        }
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
          maxTicksLimit: 2000,
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
          maxTicksLimit: 2000,
          callback: function(_value: string | number, index: number, ticks: any[]) {
            // Só mostra label em horas cheias
            const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            const label = linearLabels[index];
            if (!label) return '';
            const d = new Date(label);
            const hour = d.getUTCHours();
            const min = d.getUTCMinutes();
            if (min === 0) {
              if (hour === 0) {
                // Mostra dia da semana e hora
                const diaSemana = dias[d.getUTCDay()];
                return `${diaSemana} ${hour.toString().padStart(2, '0')}:00`;
              }
              // Mostra apenas hora cheia
              return `${hour.toString().padStart(2, '0')}:00`;
            }
            // Não mostra label para outros minutos
            return '';
          },
          font: {
            size: 10
          }
        }
      }
    },
    elements: {
      point: {
        radius: 3,
        hitRadius: 5,
        hoverRadius: 7
      },
      line: {
        tension: 0 // Linhas retas entre pontos
      }
    }
  };

  return (
    <div className="chart-wrapper" style={{ margin:"0px", width: "1300px", height: "750px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default CfdChart;
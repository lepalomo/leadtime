import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import cfdData from './data/cfd_data_realistic_adjusted.json';

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
  d.setSeconds(0, 0);
  return d.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2').replace(' ', 'T') + ':00.000Z';
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

const CfdChart: React.FC = () => {
 const chartData = useMemo(() => parseData(), []);


  // Gera labels lineares de minuto em minuto para os dias 16 e 17/05/2025 (UTC)
  // Excluindo o período entre 01:00 e 18:00 do dia 17/05/2025
  const start = new Date('2025-05-16T19:00:00.000Z');
  const end = new Date('2025-05-17T23:59:00.000Z');
  const skipStart = new Date('2025-05-17T01:00:00.000Z');
  const skipEnd = new Date('2025-05-17T18:00:00.000Z');
  
  const linearLabels: string[] = [];
  let d = new Date(start);
  while (d <= end) {
    // Pula os timestamps entre 01:00 e 18:00 do dia 17
    if (d < skipStart || d >= skipEnd) {
      linearLabels.push(d.toISOString());
    }
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

  const maximo = Math.max(...linearData.flatMap(values => values));
  const data = {
    labels: linearLabels,
    datasets: phases.map((phase, idx) => ({
      label: phase,
      data: linearData.map(values => values[idx]),
      fill: true,
      backgroundColor: [
        'rgba(0, 131, 0, 0.7)',
        'rgba(3, 243, 252, 0.7)',
        'rgba(75, 0, 173, 0.86)',
        'rgb(255, 217, 2)',
        'rgba(255, 147, 5, 0.88)', // Amarelo mais escuro
        'rgba(255, 0, 0, 0.7)' // Amarelo mais escuro
      ][idx],
    }))
  };

  const options = {
    responsive: true,
    animations: {},
    plugins: {
      tooltip: {
        enabled: true,
        intersect: false, // Adicionado intersect: false
        callbacks: {
          title: function(context: any) {
            if (!context.length) return '';
            const label = context[0].label;
            if (!label) return '';
            const d = new Date(label);
            if (isNaN(d.getTime())) return label;
            const dia = String(d.getUTCDate()).padStart(2, '0');
            const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
            const hora = String(d.getUTCHours()).padStart(2, '0');
            const min = String(d.getUTCMinutes()).padStart(2, '0');
            const formattedTitle = `${dia}/${mes} ${hora}:${min}`;
            return formattedTitle;
          },
          label: function(context: any) {
            const value = context.dataset.data[context.dataIndex];
            const formattedLabel = `${value} pedidos`;
            return formattedLabel;
          }
        }
      },
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
    },
    scales: {
      y: {
        stacked: false,
        beginAtZero: true,
        grid: {
          lineWidth: 1,
          drawBorder: false
        },
        ticks: {
          display: false,
          autoSkip: false,
          maxTicksLimit: 200,
          stepSize: 0.1,
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
            const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sábado'];
            const label = linearLabels[index];
            if (!label) return '';
            const d = new Date(label);
            const hour = d.getUTCHours();
            const min = d.getUTCMinutes();
            
            // Verifica se é hora cheia (minutos = 0)
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
        radius: 0, // Remove pontos
        hitRadius: 0,
        hoverRadius: 0
      },
      line: {
        tension: 0.1, // Suaviza as curvas
        borderWidth: 0 // Remove bordas
      }
    }
  };

  try {
    return (
      <div className="chart-wrapper" style={{ margin:"0px", width: "1300px", height: "750px" }}>
        {chartData && chartData.length > 0 ? (
          <Line data={data} options={options}/>
        ) : (
          <p>Não há dados para exibir o gráfico CFD.</p>
        )}
      </div>
    );
  } catch (error) {
    return <p>Erro ao exibir o gráfico CFD.</p>;
  }
};

export default CfdChart;

import React, { useEffect, useRef, useState } from 'react';
import Reveal from 'reveal.js';
import type { RevealOptions } from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/sky.css';
import './chartRegister';
import CfdChart from './CfdChart';
import LeadtimeChart from './LeadtimeChart';
import LeadtimeBreakdownChart from './LeadtimeBreakdownChart';
import CycletimesChart from './CycletimesChart';
import PieChart from './DoughnutChart';
import { Chart } from 'chart.js';
import ThroughputByBordaChart from './ThroughputByBordaChart';
import ThroughputChart from './ThroughputChart';
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
  ArcElement,
} from 'chart.js';

// Removendo o registro de componentes do App.tsx


const App = () => {
  const chartRefs = useRef<Record<string, Chart | null>>({});
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clean up charts on unmount
    return () => {
      Object.values(chartRefs.current).forEach(chart => {
        chart?.destroy();
      });
    };
  }, []);

  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [totalSlides, setTotalSlides] = useState<number>(1);

  const storePhaseTimes = {
    store1: {
      waitingPreparation: 25,
      preparation: 15,
      waitingPackaging: 2,
      packaging: 2,
      waitingDelivery: 2,
      delivery: 11,
      averageTotal: 65
    },
    store2: {
      waitingPreparation: 5,
      preparation: 15,
      waitingPackaging: 3,
      packaging: 2,
      waitingDelivery: 3,
      delivery: 27,
      averageTotal: 63
    },
    store3: {
      waitingPreparation: 8,
      preparation: 18,
      waitingPackaging: 12,
      packaging: 5,
      waitingDelivery: 2,
      delivery: 12,
      averageTotal: 66
    }
  };

  useEffect(() => {
    const deck = new Reveal({
      backgroundTransition: 'slide',
      hash: true,
      progress: true,
      controls: true,
      transition: 'slide',
      fragments: false,
      width: 1300,
      margin: 0.05,
      keyboard: {
        39: 'next', // Right arrow
        37: 'prev', // Left arrow
        38: 'prev', // Up arrow
        40: 'next', // Down arrow
      },
      navigationMode: 'linear',
      pdf: true
    });
    deck.initialize();

    deck.on('ready', () => {
      setActiveSlide(deck.getIndices().h);
      setTotalSlides(deck.getTotalSlides());
    });

    deck.on('slidechanged', (event: { indexh: number }) => {
      setActiveSlide(event.indexh);
    });
  }, []);

  return (
    <div className="reveal" ref={revealRef}>
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          color: '#333333',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {activeSlide + 1} / {totalSlides}
      </div>
      <div className="slides">
        <section>
          <h2>Métricas Ágeis</h2>
        </section>
        <section>
          <h2>Gio Pizzas</h2>
          <p>A rede de pizzarias GIO PIZZAS tem 3 lojas. Em recente pesquisa de satisfação, concluiu que a maioria dos clientes gosta muito da qualidade do produto,
            mas reclama do tempo de entrega.</p>
        </section>
        <section>
          <h2>Visualização de Leadtime</h2>
          <div style={{ width: '80%', margin: '0 auto' }}>
            <LeadtimeChart shouldAnimate={activeSlide === 1} />
          </div>
        </section>
        <section>
          <h2>Leadtime Breakdown</h2>
          <p>Garante a visualização detalhada das fases do processo</p>
          <p>Loja 1 - Possui um forno pequeno para muita demanda.</p>
          <div style={{ width: '75%', margin: '0 auto' }}>
            <LeadtimeBreakdownChart
              shouldAnimate={activeSlide === 2}
              phaseTimes={storePhaseTimes.store1}
            />
          </div>
        </section>
        <section>
          <h2>Leadtime Breakdown</h2>
          <p>Garante a visualização detalhada das fases do processo</p>
          <p>Loja 2 - Boa estrutura para preparo, mas cada entregador sai com 4 a 6 pizzas.</p>
          <div style={{ width: '75%', margin: '0 auto' }}>
            <LeadtimeBreakdownChart
              shouldAnimate={activeSlide === 3}
              phaseTimes={storePhaseTimes.store2}
            />
          </div>
        </section>
        <section>
          <h2>Leadtime Breakdown</h2>
          <p>Garante a visualização detalhada das fases do processo</p>
          <p>Loja 3 - O pedido entra rapidamente para preparo e sempre tem entregadores disponíveis, mas o leadtime é o mesmo das outras.</p>
          <div style={{ width: '70%', margin: '0 auto' }}>
            <LeadtimeBreakdownChart
              shouldAnimate={activeSlide === 4}
              phaseTimes={storePhaseTimes.store3}
            />
          </div>
        </section>
        <section>
          <h2>Cycletimes - Tempos de ciclo</h2>
          <p>Visão consolidada dos principais processos</p>
          <div style={{ width: '80%', margin: '0 auto' }}>
            <CycletimesChart shouldAnimate={activeSlide === 3} />
          </div>
        </section>
        <section>
          <h2>Médias de Cada Ciclo</h2>
          <div style={{ width: '90%', margin: '0 auto', textAlign: 'center' }}>
            <h3>Cycletime médio</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginTop: '0px'
            }}>
              <PieChart shouldAnimate={activeSlide === 4} preparationTime={70} deliveryTime={30} title="Loja 1" />
              <PieChart shouldAnimate={activeSlide === 4} preparationTime={60} deliveryTime={40} title="Loja 2" />
              <PieChart shouldAnimate={activeSlide === 4} preparationTime={80} deliveryTime={20} title="Loja 3" />
            </div>
          </div>
        </section>
        <section>
          <h2>GIO PIZZAS</h2>
          <p>Com os dados em mãos, não só a gestão mas toda a equipe agora pode acompanhar o tempo de produção e tratar gargalos.</p>
          <p>As avaliações melhoraram e houve um impacto positivo no faturamento.</p>

        </section>
        <section>
          <p>A GIO pizzas abriu duas novas lojas, novas pessoas foram contratadas e, apesar de criar, documentar e acompanhar de perto o processo, a nova fase da empresa exigia,
            além de eficiência operacional, previsibilidade de faturamento, de consumo de ingredientes e até uma melhor gestão da escala de trabalho do time.</p>
        </section>
        <section>
          <h2>PREVISIBILIDADE</h2>
          <p>A gestão da GIO PIZZAS decidiu então implementar uma visualização conhecida como "throughput" (vazão).</p>
          <p>Diferente do leadtime, que mostra o tempo para cada pedido, o throughput mostra a quantidade de pedidos no tempo.</p>
        </section>
        <section>
          <h2>Throughput</h2>
          <p>A visualização abaixo mostra claramente a diferença entre os dias, e permite ter uma visão macro da média de pedidos por dia.</p>
          <div style={{ width: '80%', margin: '0 auto' }}>
            <ThroughputChart shouldAnimate={activeSlide === 19} />
          </div>
        </section>

        <section>
          <h2>Throughput - Tipo de Borda</h2>
          <p>Analisando por tipo de borda, podemos ver que às segundas há maior preferência por bordas recheadas.</p>
          <div style={{ width: '80%', margin: '0 auto' }}>
            <ThroughputByBordaChart shouldAnimate={activeSlide === 20} />
          </div>
        </section>
        <section>
          <h2>GIO PIZZAS</h2>
          <p>A gestão da GIO PIZZAS implementou as visualizações de leadtime médio, cycletimes e throughput pra cada loja, mas cuidando de cinco lojas,
            e com a previsão de abrir mais três até o fim do ano, parece que a tela já está começando a ficar cheia e confusa.</p>
        </section>
        <section>
          <blockquote>Será que existe alguma forma de compactar esses gráficos e fazer um acompanhamento que varie do detalhe a algo mais macro,
            sem a necessidade de ficar rolando a tela de cima pra baixo o tempo todo?</blockquote>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <img
              src="src/assets/loading-thinking.gif"
              alt="Loading"
              style={{ width: '250px', height: 'auto' }}
            />
          </div>
        </section>
        <section>
          <h2>Cummulative Flow Diagram (CFD)</h2>
          <p>Foi implementada uma visualização conhecida como CFD, ou Diagrama de Fluxo Cumulativo, que permite que em um único gráfico se tenha dados de gargalos,
            vazão, leadtime médio, entre outros números.</p>
        </section>
        <section>
          <h2>CFD</h2>
          <div>
            <CfdChart />
          </div>
        </section>
        <section>
          <h2>CFD</h2>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <img
              src="src/assets/cfd_chart.png"
              alt="CFD Chart"
              style={{ width: '80%', maxWidth: '900px', height: 'auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            />
          </div>
        </section>
        <section>
          <h2>Boas práticas: Kanban</h2>
          <ul>
            <li>Nunca voltar itens em um quadro kanban que gere métricas;</li>
            <li>Não ter uma coluna para "impedidos", "bloqueados";</li>
            <li>O item fica parado na coluna em que está, até que qualquer impedimento se resolva;</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default App;

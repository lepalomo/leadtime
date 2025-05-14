import React, { useEffect, useRef, useState } from 'react';
import Reveal from 'reveal.js';
import type { RevealOptions } from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/sky.css';
import CumulativeFlowChart from './CumulativeFlowChart';
import LeadtimeChart from './LeadtimeChart';
import LeadtimeBreakdownChart from './LeadtimeBreakdownChart';
import CycletimesChart from './CycletimesChart';
import PieChart from './DoughnutChart';
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);


const App = () => {
  const chartRefs = useRef<Record<string, ChartJS | null>>({});
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
      fragments: true,
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
          <h2>Gio Pizzas</h2>
          <p>Como os sistemas já são padronizados entre as 3 lojas, não foi difícil conseguir o dado do tempo médio entre pedido e entrega.</p>
          <p>A gestão levantou essa informação recorrendo a uma métrica chamada <strong>LEADTIME</strong>.</p>
        </section>
        <section>
          <h2>Visualização de Leadtime</h2>
          <div style={{ width: '80%', margin: '0 auto' }}>
            <LeadtimeChart shouldAnimate={activeSlide === 2} />
          </div>
        </section>
        <section>
          <h2>Leadtime - Simples, mas muito útil</h2>
          <p>O dado de leadtime é tão simples quanto útil, porque traz a informação mais importante do <strong>ponto de vista do cliente:</strong> o tempo total entre o pedido e a entrega.</p>
        </section>
        <section>
          <p>No fim do dia, quem pede uma pizza não quer saber se o pizzaiolo é lento, se precisou abrir um novo frasco de azeitonas ou se o forno demorou a aquecer, sua experiência está diretamente ligada ao tempo entre o momento que pediu até o momento que a pizza está disponível pra ser consumida.</p>
          <div style={{ textAlign: 'center', padding: '0px' }}>
            <img src="src/assets/pizza-box-free-svg-file.png" alt="Caixa de Pizza" style={{ width: '200px', height: 'auto' }} />
          </div>
        </section>
        <section>
          <h2>Gio Pizzas</h2>
          <p>Agora, do <strong>ponto de vista do negócio</strong>, fica a dúvida:</p>
          <ul>
            <li>É possível reduzir o leadtime?
              Caso sim, como?</li>
          </ul>
        </section>
        <section>
          <p>Como dito inicialmente, a GIO PIZZAS tem 3 lojas. <br />E parece que a realidade de cada uma é um pouco diferente.</p>

          <p>
            <span>🍕</span>
            <strong>Loja 1:</strong> Possui um forno pequeno para muita demanda.
          </p>
          <p>
            <span>🍕</span>
            <strong>Loja 2:</strong> Boa estrutura para preparo, mas cada entregador sai com 4 a 6 pizzas.
          </p>
          <p>
            <span>🍕</span>
            <strong>Loja 3:</strong> O pedido entra rapidamente para preparo e sempre tem entregadores disponíveis, mas o leadtime é o mesmo das outras.
          </p>
        </section>
        <section>
          <h2>Leadtime Breakdown</h2>
          <p>Para entender como as particularidades de cada loja afetam o tempo total da entrega, foi feita uma análise chamada <strong>leadtime breakdown</strong></p>
        </section>
        <section>
          <h2>Leadtime Breakdown</h2>
          <p>Garante a visualização detalhada das fases do processo</p>
          <p>Loja 1 - Possui um forno pequeno para muita demanda.</p>
          <div style={{ width: '80%', margin: '0 auto' }}>
            <LeadtimeBreakdownChart
              shouldAnimate={activeSlide === 3}
              phaseTimes={storePhaseTimes.store1}
            />
          </div>
        </section>
        <section>
          <h2>Leadtime Breakdown</h2>
          <p>Garante a visualização detalhada das fases do processo</p>
          <p>Loja 2 - Boa estrutura para preparo, mas cada entregador sai com 4 a 6 pizzas.</p>
          <div style={{ width: '80%', margin: '0 auto' }}>
            <LeadtimeBreakdownChart
              shouldAnimate={activeSlide === 4}
              phaseTimes={storePhaseTimes.store2}
            />
          </div>
        </section>
        <section>
          <h2>Leadtime Breakdown</h2>
          <p>Garante a visualização detalhada das fases do processo</p>
          <p>Loja 3 - O pedido entra rapidamente para preparo e sempre tem entregadores disponíveis, mas o leadtime é o mesmo das outras.</p>
          <div style={{ width: '80%', margin: '0 auto' }}>
            <LeadtimeBreakdownChart
              shouldAnimate={activeSlide === 5}
              phaseTimes={storePhaseTimes.store3}
            />
          </div>
        </section>
        <section>
          <h2>Acompanhamento</h2>
          <p>Agora que os problemas em cada loja foram endereçados, para que não voltem a acontecer, a gestão da GIO PIZZAS pensou em uma forma simples de acompanhar o processo continuamente.</p>
          <p>Em nível de gestão geral, o Leadtime Breakdown (mostrando todas as fases do processo) parece apresentar detalhes demais, e o Leadtime, detalhes de menos.</p>
        </section>
        <section>
          <h2>Cycletime - Acompanhamento</h2>
          <p>O ideal seria uma visão intermediária entre os dois extremos.</p>
          <p>Uma visão que mostre o tempo total, mas também as fases mais importantes do processo.</p>
          <p>A solução foi adotar uma visualização <strong>CYCLETIME</strong> (tempo de ciclo)</p>
        </section>
        <section>
          <h2>Cycletimes - Tempos de ciclo</h2>
          <p>Visão consolidada dos principais processos</p>
          <div style={{ width: '80%', margin: '0 auto' }}>
            <CycletimesChart shouldAnimate={activeSlide === 4} />
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
              <PieChart shouldAnimate={activeSlide === 5} preparationTime={70} deliveryTime={30} title="Loja 1" />
              <PieChart shouldAnimate={activeSlide === 5} preparationTime={60} deliveryTime={40} title="Loja 2" />
              <PieChart shouldAnimate={activeSlide === 5} preparationTime={80} deliveryTime={20} title="Loja 3" />
            </div>
          </div>
        </section>
        <section>
          <h2>GIO PIZZAS</h2>
          <p>Com os dados em mãos, não só a gestão mas toda a equipe agora pode acompanhar o o tempo de produção e tratar gargalos.</p>
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
            <ThroughputChart shouldAnimate={activeSlide === 20} />
          </div>
        </section>

        <section>
          <h2>Throughput - Tipo de Borda</h2>
          <p>Analisando por tipo de borda, podemos ver que às segundas há maior preferência por bordas recheadas.</p>
          <div style={{ width: '80%', margin: '0 auto' }}>
            <ThroughputByBordaChart shouldAnimate={activeSlide === 21} />
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
        <section>          <h2>CFD</h2>
          <div>
            <div className="cfd-chart-container">
              <CumulativeFlowChart />
            </div>
          </div>
        </section>
        <section>
          <h2>Boas práticas: <br />Visualizações de leadtime</h2>
          <ul>
            <li>As visualizações se dão majoritariamente em gráficos de barras;</li>
            <li>O leadtime é medido em dias corridos, horas úteis ou dias úteis;</li>
          </ul>
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

import React, { useEffect, useRef, useState } from 'react';
import Reveal from 'reveal.js';
import type { RevealOptions } from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/sky.css';
import CfdChart from './CfdChart';
import LeadtimeChart from './LeadtimeChart';
import LeadtimeBreakdownChart from './LeadtimeBreakdownChart';
import CycletimesChart from './CycletimesChart';
import PieChart from './DoughnutChart';
import ThroughputByBordaChart from './ThroughputByBordaChart';
import ThroughputChart from './ThroughputChart';
import ChartWrapper from './ChartWrapper';

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
            <ChartWrapper
              component={LeadtimeChart}
              componentProps={{ shouldAnimate: activeSlide === 2 }}
              fallback={<div>Carregando gráfico de leadtime...</div>}
              key={activeSlide === 2 ? 'leadtime-active' : 'leadtime'}
            />
          </div>
        </section>
        <section>
          <h2>Leadtime Breakdown</h2>
          <p>Garante a visualização detalhada das fases do processo</p>
          <p>Loja 1 - Possui um forno pequeno para muita demanda.</p>
          <div style={{ width: '75%', margin: '0 auto' }}>
            <ChartWrapper
              component={LeadtimeBreakdownChart}
              componentProps={{
                shouldAnimate: activeSlide === 3,
                phaseTimes: storePhaseTimes.store1
              }}
              fallback={<div>Carregando breakdown de leadtime...</div>}
              key={activeSlide === 3 ? 'breakdown1-active' : 'breakdown1'}
            />
          </div>
        </section>
        <section>
          <h2>Cycletimes - Tempos de ciclo</h2>
          <p>Visão consolidada dos principais processos</p>
          <div style={{ width: '75%', margin: '0 auto' }}>
            <ChartWrapper
              component={CycletimesChart}
              componentProps={{ shouldAnimate: activeSlide === 4 }}
              fallback={<div>Carregando gráfico de cycletimes...</div>}
              key={activeSlide === 4 ? 'cycletime-active' : 'cycletime'}
            />
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
              <ChartWrapper
                component={PieChart}
                componentProps={{ shouldAnimate: activeSlide === 5, preparationTime: 70, deliveryTime: 30, title: "Loja 1" }}
                fallback={<div>Carregando gráfico de pizza...</div>}
                key={activeSlide === 5 ? 'pie1-active' : 'pie1'}
              />
              <ChartWrapper
                component={PieChart}
                componentProps={{ shouldAnimate: activeSlide === 5, preparationTime: 60, deliveryTime: 40, title: "Loja 2" }}
                fallback={<div>Carregando gráfico de pizza...</div>}
                key={activeSlide === 5 ? 'pie2-active' : 'pie2'}
              />
              <ChartWrapper
                component={PieChart}
                componentProps={{ shouldAnimate: activeSlide === 5, preparationTime: 80, deliveryTime: 20, title: "Loja 3" }}
                fallback={<div>Carregando gráfico de pizza...</div>}
                key={activeSlide === 5 ? 'pie3-active' : 'pie3'}
              />
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
            <ChartWrapper
              component={ThroughputChart}
              componentProps={{ shouldAnimate: activeSlide === 20 }}
              fallback={<div>Carregando gráfico de throughput...</div>}
              key={activeSlide === 20 ? 'throughput-active' : 'throughput'}
            />
          </div>
        </section>
        <section>
          <h2>Throughput - Tipo de Borda</h2>
          <p>Analisando por tipo de borda, podemos ver que às segundas há maior preferência por bordas recheadas.</p>
          <div style={{ width: '80%', margin: '0 auto' }}>
            <ChartWrapper
              component={ThroughputByBordaChart}
              componentProps={{ shouldAnimate: activeSlide === 21 }}
              fallback={<div>Carregando gráfico de throughput por borda...</div>}
              key={activeSlide === 21 ? 'bordas-active' : 'bordas'}
            />
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
          <h2>Cumulative Flow Diagram (CFD)</h2>
          <p>Foi implementada uma visualização conhecida como CFD, ou Diagrama de Fluxo Cumulativo, que permite que em um único gráfico se tenha dados de gargalos,
            vazão, leadtime médio, entre outros números.</p>
        </section>
        <section>
          <h2>CFD</h2>
          <div>
            <CfdChart key={activeSlide === 23 ? 'cfd-active' : 'cfd'} />
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

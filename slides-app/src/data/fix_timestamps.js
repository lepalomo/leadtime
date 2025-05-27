import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Carrega os dados originais
const dataPath = join(__dirname, 'cfd_data_realistic_adjusted.json');
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

// Intervalos base entre fases em minutos (índice 0-1, 1-2, etc)
const BASE_INTERVALS = [5, 15, 3, 3, 8, 15];

// Função para verificar se está no horário de pico (20h-21h)
function isPeakTime(startTime) {
  const hour = new Date(startTime).getUTCHours();
  return hour >= 20 && hour < 21;
}

// Função para gerar variação de ±10%
function getRandomVariation() {
  return 1 + (Math.random() * 0.2 - 0.1);
}

// Função para gerar horário inicial entre 19h e 22:30
function generateStartTime() {
  const baseDate = new Date('2025-05-14T00:00:00Z');
  const randomHour = 19 + Math.random() * 3.5;
  const hours = Math.floor(randomHour);
  const minutes = Math.floor((randomHour - hours) * 60);
  baseDate.setUTCHours(hours, minutes, 0, 0);
  return baseDate;
}

// Função para reconstruir os timestamps
function rebuildTimestamps() {
  const startTime = generateStartTime();
  const timestamps = [startTime.toISOString()];
  let currentTime = new Date(startTime);
  const peakTime = isPeakTime(startTime);

  BASE_INTERVALS.forEach((baseInterval, index) => {
    let interval = baseInterval * getRandomVariation();
    
    // Triplica o tempo da 3ª fase (índice 2-3) durante o pico
    if (peakTime && index === 2) {
      interval *= 3;
    }
    
    currentTime = new Date(currentTime.getTime() + interval * 60 * 1000);
    timestamps.push(currentTime.toISOString());
  });

  return timestamps;
}

// Processa todos os pedidos
const processedData = data.map(() => rebuildTimestamps());

// Salva o arquivo ajustado
const outputPath = join(__dirname, 'cfd_data_realistic_adjusted.json');
writeFileSync(outputPath, JSON.stringify(processedData, null, 2));

console.log('Dados ajustados com:');
console.log('- Triplicação da 3ª fase entre 20h-21h');
console.log('- Variação de ±10% em outros intervalos');
console.log('- Ajuste automático das fases subsequentes');
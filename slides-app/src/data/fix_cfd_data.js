// Script para ajustar cfd_data.json conforme regras de horário
// Uso: node fix_cfd_data.js

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'cfd_data.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

function clampToHour(dateStr, hour, minute) {
  const d = new Date(dateStr);
  d.setHours(hour, minute, 0, 0);
  // Mantém a data original
  return d.toISOString().slice(0, 16) + ':00';
}

const fixed = data.map(row => {
  if (!Array.isArray(row) || row.length !== 6) return row;
  // Última fase (índice 5): máximo 23:00
  let last = row[5];
  let dLast = new Date(last);
  if (dLast.getHours() > 23 || (dLast.getHours() === 23 && dLast.getMinutes() > 0)) {
    last = clampToHour(last, 23, 0);
  }
  // Primeira fase (índice 0): máximo 23:55
  let first = row[0];
  let dFirst = new Date(first);
  if (dFirst.getHours() > 23 || (dFirst.getHours() === 23 && dFirst.getMinutes() > 55)) {
    first = clampToHour(first, 23, 55);
  }
  // Garante ordem cronológica decrescente
  let newRow = [first, row[1], row[2], row[3], row[4], last];
  for (let i = 1; i < 6; i++) {
    if (new Date(newRow[i]) > new Date(newRow[i - 1])) {
      // Se alguma fase ficou depois da anterior, ajusta para 1 min antes
      let prev = new Date(newRow[i - 1]);
      prev.setMinutes(prev.getMinutes() - 1);
      newRow[i] = prev.toISOString().slice(0, 16) + ':00';
    }
  }
  return newRow;
});

fs.writeFileSync(file, JSON.stringify(fixed, null, 2));
console.log('Arquivo corrigido!');

# 📊 Aplicativo de Visualização de Leadtime

<div align="center">

![Leadtime](https://img.shields.io/badge/Leadtime-Visualização-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?logo=chart.js)

*Apresentação interativa sobre métricas de entrega e indicadores de desempenho*

</div>

## ✨ Funcionalidades

- 📈 **Gráficos Interativos** - Responsivos
- 🎞️ **Apresentações em Slides** - Usando Reveal.js
- 📱 **Design Responsivo** - Funciona em dispositivos desktop e móveis

## 🚀 Stack Tecnológica

- **Frontend:** React com TypeScript
- **Ferramenta de Build:** Vite
- **Apresentação:** Reveal.js
- **Visualização:** Chart.js com React-ChartJS-2
- **Estilização:** Tema personalizado

## 🛠️ Início Rápido

### Pré-requisitos

- Node.js (v14+)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/leadtime.git

# Navegue até o diretório do projeto
cd leadtime/slides-app

# Instale as dependências
npm install
# ou
yarn install

# Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
```

Visite `http://localhost:5173` no seu navegador para ver a apresentação em ação!

## 📦 Compilando para Produção

```bash
npm run build
# ou
yarn build
```

## 📂 Estrutura do Projeto

```
slides-app/
├── src/
│   ├── App.tsx              # Aplicação principal
│   ├── theme.ts             # Tema personalizado
│   ├── charts/              # Componentes de gráficos
│   │   ├── CfdChart.tsx     # Diagrama de Fluxo Cumulativo
│   │   ├── LeadtimeChart.tsx
│   │   └── ThroughputChart.tsx
│   └── ...
├── public/                  # Ativos estáticos
└── vite.config.ts          # Configuração do Vite
```

## 🤝 Contribuindo

1. **Faça um fork** do repositório
2. **Clone** seu fork
3. **Crie** uma branch para sua funcionalidade: `git checkout -b feature/funcionalidade-incrivel`
4. **Commit** suas alterações: `git commit -m 'Adiciona funcionalidade incrível'`
5. **Push** para sua branch: `git push origin feature/funcionalidade-incrivel`
6. Abra um **Pull Request**

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">
  <sub>Construído com ❤️ para aprendizado de métricas de entrega</sub>
</div>
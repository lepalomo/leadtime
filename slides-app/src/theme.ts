import { defaultTheme } from 'spectacle';

export const theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: '#4361ee', // Azul vibrante
    secondary: '#3a0ca3', // Roxo profundo
    tertiary: '#f72585', // Rosa
    background: '#f8f9fa', // Fundo claro
    text: '#001a33'
  },
  fontSizes: {
    h1: '4.5rem',
    h2: '3.5rem',
    h3: '2.5rem',
    text: '1.8rem'
  },
  space: [16, 24, 32, 48],
  transitions: {
    default: 'all 0.3s ease-in-out'
  }
};
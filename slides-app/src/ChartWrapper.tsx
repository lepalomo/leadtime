import React, { useId, useEffect, forwardRef, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register all required Chart.js components centrally
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartWrapperProps<T extends React.ElementType> {
  component: T;
  componentProps: React.ComponentProps<T>;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ChartErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chart Error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Error rendering chart</div>;
    }
    return this.props.children;
  }
}

const ChartWrapper = forwardRef<ChartJS, ChartWrapperProps<any>>(
  ({ component: Component, componentProps, fallback }, ref) => {
    const chartId = useId();
    const [registered, setRegistered] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Verifica se os elementos necessários estão registrados
    useEffect(() => {
      try {
        // Verifica apenas as escalas essenciais
        const requiredScales = ['linear', 'category'];
        const missingScales = requiredScales.filter(scale => !ChartJS.registry.scales.get(scale));
        
        if (missingScales.length > 0) {
          const errorMsg = `Missing essential Chart.js scales: ${missingScales.join(', ')}
          
          This usually means:
          1. The scales were not properly registered in main.tsx
          2. The Chart.js version may be incompatible
          3. There's a bundling/import issue
          
          Check the console for registration details`;
          console.error(errorMsg);
          console.debug('Chart.js registry state:', ChartJS.registry);
          setError(errorMsg);
        } else {
          setRegistered(true);
        }
      } catch (err) {
        console.error('Chart registration check failed:', err);
        setError('Failed to check chart registrations');
      }
    }, []);

    // Cleanup chart on unmount or update
    useEffect(() => {
      return () => {
        try {
          const chartInstance = ChartJS.getChart(chartId);
          if (chartInstance) {
            chartInstance.destroy();
          }
        } catch (err) {
          console.error('Failed to destroy chart:', err);
        }
      };
    }, [chartId]);

    if (error) {
      return fallback || (
        <div style={{ color: 'red', padding: '1rem', border: '1px solid red' }}>
          <strong>Chart Configuration Error</strong>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      );
    }

    if (!registered) {
      return fallback || <div>Loading chart...</div>;
    }

    return (
      <ChartErrorBoundary 
        fallback={fallback}
        onError={(err) => console.error('Chart rendering failed:', err)}
      >
        <div data-chart-id={chartId}>
          <Component {...componentProps} datasetIdKey={chartId} ref={ref} />
        </div>
      </ChartErrorBoundary>
    );
  }
);

ChartWrapper.displayName = 'ChartWrapper';

export default ChartWrapper;
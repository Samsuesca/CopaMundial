import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] flex items-center justify-center p-8">
          <div className="bg-[var(--color-bg-darker)] rounded-xl p-6 border border-red-500/30 max-w-md text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Algo salió mal</h3>
            <p className="text-gray-400 text-sm mb-4">
              {this.state.error?.message || 'Ha ocurrido un error inesperado'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-[var(--color-primary)] text-[var(--color-bg-dark)] rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-4 h-4" />
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

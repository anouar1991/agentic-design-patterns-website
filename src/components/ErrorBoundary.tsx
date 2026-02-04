import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { createLogger } from '../utils/logger';

interface Props {
  children: ReactNode;
  /** Context tag for logging (e.g. 'Diagram', 'Quiz') */
  context?: string;
  /** Optional custom fallback — receives error and reset callback */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
  resetKey: number;
}

/**
 * Catches React rendering errors in descendant components and shows a
 * styled fallback UI with a retry button instead of a white screen.
 *
 * Usage:
 *   <ErrorBoundary context="Diagram">
 *     <InteractiveDiagram ... />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component<Props, State> {
  private log;

  constructor(props: Props) {
    super(props);
    this.state = { error: null, resetKey: 0 };
    this.log = createLogger(props.context ? `ErrorBoundary:${props.context}` : 'ErrorBoundary');
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.log.error('Component crashed:', error.message, info.componentStack);
  }

  private handleReset = () => {
    this.setState((prev) => ({ error: null, resetKey: prev.resetKey + 1 }));
  };

  render() {
    const { error } = this.state;
    const { children, fallback, context } = this.props;

    if (error) {
      if (fallback) {
        return fallback(error, this.handleReset);
      }

      return (
        <div
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center"
        >
          <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-400" />
          <h3 className="mb-1 text-lg font-semibold text-dark-50">
            {context ? `${context} failed to load` : 'Something went wrong'}
          </h3>
          <p className="mb-4 text-sm text-dark-400">
            {error.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500/40"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}

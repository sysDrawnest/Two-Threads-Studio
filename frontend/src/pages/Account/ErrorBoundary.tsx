import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Account component crashed:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="border border-red-200 p-8 bg-red-50 text-left space-y-4">
          <h3 className="font-serif text-lg text-red-950 font-semibold">
            Something went wrong while rendering this section.
          </h3>
          <p className="text-sm text-red-800">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 border border-red-800 text-xs font-mono uppercase tracking-widest text-red-900 hover:bg-red-800 hover:text-white transition-colors duration-300"
          >
            Retry Section
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

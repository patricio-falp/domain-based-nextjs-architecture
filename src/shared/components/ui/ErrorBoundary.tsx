/**
 * Error Boundary Component
 *
 * React Error Boundary for graceful error handling in the UI.
 * Catches JavaScript errors anywhere in the child component tree.
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { Card } from './Card';

// ===========================================
// TYPES
// ===========================================

interface ErrorBoundaryProps {
  /** Child components */
  children: ReactNode;
  /** Custom fallback UI */
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  /** Error callback */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Show detailed error in development */
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ===========================================
// COMPONENT
// ===========================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught error:', error, errorInfo);
    }

    // Call optional error callback
    this.props.onError?.(error, errorInfo);

    // Update state with error info
    this.setState({ errorInfo });

    // TODO: Send to error tracking service (Sentry, etc.)
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, showDetails = process.env.NODE_ENV === 'development' } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, this.resetError);
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-(--color-bg-subtle)">
          <Card className="max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg
                    className="h-12 w-12 text-(--color-error)"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-(--color-fg) mb-2">
                    Something went wrong
                  </h2>
                  <p className="text-(--color-fg-muted) mb-4">
                    An unexpected error occurred. Please try refreshing the page or contact support
                    if the problem persists.
                  </p>

                  {showDetails && (
                    <details className="mb-4">
                      <summary className="cursor-pointer text-sm font-medium text-(--color-fg-subtle) mb-2">
                        Error Details (Development Mode)
                      </summary>
                      <div className="bg-(--color-bg-muted) rounded-lg p-4 overflow-auto">
                        <p className="text-sm font-mono text-(--color-error) mb-2">
                          {error.toString()}
                        </p>
                        {this.state.errorInfo && (
                          <pre className="text-xs text-(--color-fg-subtle) whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        )}
                      </div>
                    </details>
                  )}

                  <div className="flex gap-3">
                    <Button onClick={this.resetError}>Try Again</Button>
                    <Button variant="outline" onClick={() => (window.location.href = '/')}>
                      Go to Home
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return children;
  }
}

// ===========================================
// FUNCTIONAL ERROR BOUNDARY (React 18+)
// ===========================================

/**
 * Functional wrapper for ErrorBoundary
 * Useful for inline usage with hooks
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// ===========================================
// PRESET ERROR BOUNDARIES
// ===========================================

/**
 * Page-level error boundary
 */
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Page Error:', error, errorInfo);
        // TODO: Send to error tracking
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Component-level error boundary with minimal UI
 */
export function ComponentErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="p-4 border border-(--color-error)/20 rounded-lg bg-(--color-error-muted)">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="h-5 w-5 text-(--color-error)"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-(--color-error-fg)">
              Failed to load component
            </span>
          </div>
          <button
            onClick={reset}
            className="text-xs text-(--color-error) hover:text-(--color-error-hover) underline"
          >
            Try again
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Silent error boundary - logs but doesn't show UI
 */
export function SilentErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={() => null}
      onError={(error) => {
        console.error('Silent error caught:', error);
        // TODO: Send to error tracking
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

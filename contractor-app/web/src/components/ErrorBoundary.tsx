import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

// Top-level catch: a single render throw must never white-screen a field tool.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info);
  }

  private handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[var(--color-surface)]">
          <h1 className="text-lg font-bold text-[var(--color-primary)] mb-2">Something went wrong</h1>
          <p className="text-sm text-[var(--color-secondary)] mb-6">Please reopen the app. Your photos are saved on this device.</p>
          <button
            onClick={this.handleReload}
            className="h-12 px-6 rounded-2xl bg-[var(--color-primary)] text-white font-bold"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

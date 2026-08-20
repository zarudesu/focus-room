import { Component } from 'react';
import type { ReactNode } from 'react';
import { strings } from '../strings';
import { resetAllData } from '../lib/storage';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/** Last-resort crash screen. If anything below throws during render
 * (e.g. a stray shape of localStorage data slipped past the getters),
 * this wipes the app's own storage and offers a clean reload instead of
 * a blank white screen. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(): void {
    resetAllData();
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="screen screen-error">
          <h1>{strings.errorBoundary.heading}</h1>
          <p>{strings.errorBoundary.body}</p>
          <button className="button-primary" onClick={this.handleReload}>
            {strings.errorBoundary.reloadButton}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

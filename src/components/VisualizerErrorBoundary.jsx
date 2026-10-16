import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * ErrorBoundary for the visualization canvas area.
 * Catches errors thrown during step rendering or algorithm generation
 * and shows a friendly recovery panel instead of a blank white crash screen.
 */
export default class VisualizerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '', algoId: props.algoId };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unknown error' };
  }

  static getDerivedStateFromProps(props, state) {
    // Reset error state when the user switches algorithm
    if (props.algoId !== state.algoId) {
      return { hasError: false, errorMessage: '', algoId: props.algoId };
    }
    return null;
  }

  componentDidCatch(error, info) {
    console.error('[VisualizerErrorBoundary] Caught error:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="vis-error-boundary">
          <div className="vis-error-card">
            <AlertTriangle className="vis-error-icon" />
            <h2 className="vis-error-title">Visualization Error</h2>
            <p className="vis-error-desc">
              Something went wrong while rendering the visualization for{' '}
              <strong>{this.props.algoId}</strong>.
            </p>
            {this.state.errorMessage && (
              <pre className="vis-error-detail">{this.state.errorMessage}</pre>
            )}
            <p className="vis-error-hint">
              Try generating a new array or switching to a different algorithm.
            </p>
            <button className="vis-error-retry-btn" onClick={this.handleRetry}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry with New Array
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

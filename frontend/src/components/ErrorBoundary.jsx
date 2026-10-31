import React from 'react';
import { CircleHelp } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('BoardEase ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="page-width inner-page" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="empty-box" style={{ maxWidth: '540px', margin: '0 auto' }}>
            <div
              className="empty-icon"
              style={{
                display: 'inline-flex',
                padding: '16px',
                borderRadius: '50%',
                background: 'rgba(217, 72, 72, 0.1)',
                color: '#d94848',
                marginBottom: '20px',
              }}
            >
              <CircleHelp size={40} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>
              Something went wrong
            </h2>
            <p style={{ color: 'var(--muted, #666)', marginBottom: '24px' }}>
              An unexpected display issue occurred in this section. Your account and saved data remain safe.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                className="btn btn-dark"
                onClick={() => {
                  this.resetError();
                  window.location.reload();
                }}
              >
                Reload page
              </button>
              <button className="btn btn-outline" onClick={this.resetError}>
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in React component:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', borderColor: 'var(--mssql-red)' }}>
            <AlertCircle size={48} color="var(--mssql-red)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Something went wrong.</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
              We encountered an unexpected error while rendering this part of the application.
            </p>
            {this.state.error && (
              <pre style={{ textAlign: 'left', background: 'var(--bg-primary)', padding: '1rem', borderRadius: '4px', overflowX: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>
                {this.state.error.toString()}
              </pre>
            )}
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '1.5rem' }}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;

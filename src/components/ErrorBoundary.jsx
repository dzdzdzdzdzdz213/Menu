import React from 'react';
import { AlertOctagon, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center', background: '#08080A', color: '#fff' }}>
          <AlertOctagon size={80} color="#F54748" style={{ marginBottom: '2rem' }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 800 }}>Something went wrong.</h1>
          <p style={{ color: '#A0A0A8', marginBottom: '2rem', maxWidth: '400px', lineHeight: 1.6 }}>We encountered an unexpected error while loading this page. Our team has been notified.</p>
          <button 
            onClick={() => window.location.href = '/'} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F54748', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <RefreshCcw size={18} /> Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

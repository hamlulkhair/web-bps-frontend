// src/components/ErrorBoundary.jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state sehingga berikutnya render akan menampilkan fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Kamu bisa log error ke layanan pelaporan error di sini
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI jika terjadi error
      return (
        <div style={{ padding: '20px', backgroundColor: '#f8d7da', color: '#721c24' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    // Normal render jika tidak ada error
    return this.props.children;
  }
}

export default ErrorBoundary;

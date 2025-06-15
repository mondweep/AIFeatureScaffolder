import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem',
          animation: 'pulse 2s infinite'
        }}>
          🤖
        </div>
        
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>
          AI is Generating Your Files
        </h3>
        
        <div style={{ marginBottom: '2rem' }}>
          <div className="spinner" style={{ 
            width: '40px', 
            height: '40px',
            borderWidth: '4px',
            color: 'var(--primary-color)'
          }}></div>
        </div>
        
        <div style={{ 
          color: '#6c757d', 
          fontSize: '0.9rem',
          maxWidth: '300px',
          textAlign: 'center'
        }}>
          <p style={{ marginBottom: '0.5rem' }}>
            ✨ Analyzing your requirements
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            🏗️ Designing architecture
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            📝 Writing code and tests
          </p>
          <p style={{ margin: 0 }}>
            📚 Creating documentation
          </p>
        </div>
      </div>
      
      <style>
        {`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        `}
      </style>
    </div>
  );
};

export default LoadingOverlay;
import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={{ 
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '1.8rem',
            fontWeight: '700',
            marginBottom: '0.25rem'
          }}>
            🚀 AI Feature Scaffolder
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '0.9rem',
            marginBottom: 0
          }}>
            Generate SPARC project files from natural language descriptions
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a 
            href="https://github.com/ruvnet/claude-code-flow/docs/sparc.md"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              padding: '0.5rem 1rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            📚 SPARC Docs
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
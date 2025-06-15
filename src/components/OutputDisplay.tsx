import React, { useState } from 'react';
import { SparcOutput } from '../types';

interface OutputDisplayProps {
  output: SparcOutput;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const copyToClipboard = async (content: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(filename);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadFiles = () => {
    output.files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const tabs = [
    { id: 'overview', label: '📋 Overview', count: null },
    { id: 'specification', label: '📝 Specification', count: null },
    { id: 'architecture', label: '🏗️ Architecture', count: null },
    { id: 'files', label: '📁 Files', count: output.files.length }
  ];

  const renderOverview = () => (
    <div>
      <div className="card-header">
        <h3 className="card-title">Generation Complete! 🎉</h3>
        <p className="card-subtitle">
          Generated {output.files.length} files in {output.generationTime}ms
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea, #764ba2)', 
          color: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{output.files.length}</h4>
          <p style={{ margin: 0, opacity: 0.9 }}>Files Generated</p>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #2ecc71, #27ae60)', 
          color: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{Math.round(output.generationTime / 1000)}s</h4>
          <p style={{ margin: 0, opacity: 0.9 }}>Generation Time</p>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #4ecdc4, #44a08d)', 
          color: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</h4>
          <p style={{ margin: 0, opacity: 0.9 }}>SPARC Compliant</p>
        </div>
      </div>

      <div className="alert alert-success">
        <strong>Ready to Use:</strong> All files follow SPARC methodology with proper structure, tests, and documentation.
      </div>

      <button 
        onClick={downloadFiles}
        className="btn btn-primary"
        style={{ width: '100%' }}
      >
        📥 Download All Files
      </button>
    </div>
  );

  const renderSpecification = () => (
    <div>
      <div className="card-header">
        <h3 className="card-title">📝 Specification Phase</h3>
        <p className="card-subtitle">Requirements and functional specifications</p>
      </div>
      
      <div className="code-preview">
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
          {output.specification || 'No specification available'}
        </pre>
      </div>
    </div>
  );

  const renderArchitecture = () => (
    <div>
      <div className="card-header">
        <h3 className="card-title">🏗️ Architecture Phase</h3>
        <p className="card-subtitle">System design and component structure</p>
      </div>
      
      <div className="code-preview">
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
          {output.architecture || 'No architecture documentation available'}
        </pre>
      </div>
    </div>
  );

  const renderFiles = () => (
    <div>
      <div className="card-header">
        <h3 className="card-title">📁 Generated Files</h3>
        <p className="card-subtitle">All SPARC-compliant files ready for use</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {output.files.map((file, index) => (
          <div 
            key={index}
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                background: '#f8f9fa',
                padding: '1rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>📄 {file.name}</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6c757d' }}>
                  {file.type} • {file.content.split('\n').length} lines
                </p>
              </div>
              
              <button
                onClick={() => copyToClipboard(file.content, file.name)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                {copiedFile === file.name ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
            
            <div className="code-preview" style={{ margin: 0, borderRadius: 0 }}>
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '0.85rem' }}>
                {file.content}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="card">
      {/* Tab Navigation */}
      <div style={{ 
        borderBottom: '1px solid var(--border-color)', 
        marginBottom: '2rem',
        display: 'flex',
        gap: '0.5rem'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-dark)',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {tab.label}
            {tab.count && (
              <span style={{ 
                background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.75rem'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'specification' && renderSpecification()}
      {activeTab === 'architecture' && renderArchitecture()}
      {activeTab === 'files' && renderFiles()}
    </div>
  );
};

export default OutputDisplay;
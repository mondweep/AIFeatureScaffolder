import React, { useState } from 'react';
import Header from './Header';
import InputForm from './InputForm';
import OutputDisplay from './OutputDisplay';
import LoadingOverlay from './LoadingOverlay';
import { FeatureRequest, SparcOutput } from '../types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<SparcOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFeatureGeneration = async (request: FeatureRequest) => {
    setIsLoading(true);
    setError(null);
    setOutput(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`);
      }

      const result: SparcOutput = await response.json();
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOutput(null);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
            <button 
              onClick={() => setError(null)}
              className="btn btn-secondary"
              style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
            >
              Dismiss
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: output ? '1fr 1fr' : '1fr', gap: '2rem' }}>
          <div>
            <InputForm 
              onSubmit={handleFeatureGeneration}
              isLoading={isLoading}
              onReset={handleReset}
            />
          </div>
          
          {output && (
            <div>
              <OutputDisplay output={output} />
            </div>
          )}
        </div>
      </main>

      {isLoading && <LoadingOverlay />}
    </div>
  );
};

export default App;
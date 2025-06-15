import React, { useState } from 'react';
import { FeatureRequest } from '../types';

interface InputFormProps {
  onSubmit: (request: FeatureRequest) => void;
  isLoading: boolean;
  onReset: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, onReset }) => {
  const [formData, setFormData] = useState<FeatureRequest>({
    description: '',
    complexity: 'medium',
    framework: 'react',
    includeTests: true,
    includeDocs: true,
    aiProvider: 'openai'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.trim()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleReset = () => {
    setFormData({
      description: '',
      complexity: 'medium',
      framework: 'react',
      includeTests: true,
      includeDocs: true,
      aiProvider: 'openai'
    });
    onReset();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">✨ Feature Request</h2>
        <p className="card-subtitle">
          Describe your feature in natural language and let AI generate the SPARC files
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Feature Description *
          </label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            placeholder="e.g., Create a user authentication system with JWT tokens, login/logout functionality, and password reset capability"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
          />
          <small style={{ color: '#6c757d', fontSize: '0.875rem' }}>
            Be specific about what you want to build. Include requirements, constraints, and expected behavior.
          </small>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="complexity">
              Complexity Level
            </label>
            <select
              id="complexity"
              name="complexity"
              className="form-select"
              value={formData.complexity}
              onChange={handleInputChange}
            >
              <option value="simple">Simple (1-2 components)</option>
              <option value="medium">Medium (3-5 components)</option>
              <option value="complex">Complex (6+ components)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="framework">
              Framework
            </label>
            <select
              id="framework"
              name="framework"
              className="form-select"
              value={formData.framework}
              onChange={handleInputChange}
            >
              <option value="react">React</option>
              <option value="vue">Vue.js</option>
              <option value="angular">Angular</option>
              <option value="svelte">Svelte</option>
              <option value="vanilla">Vanilla JS</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="aiProvider">
            AI Provider
          </label>
          <select
            id="aiProvider"
            name="aiProvider"
            className="form-select"
            value={formData.aiProvider}
            onChange={handleInputChange}
          >
            <option value="openai">OpenAI GPT-4</option>
            <option value="anthropic">Anthropic Claude</option>
            <option value="google">Google Gemini</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="includeTests"
              checked={formData.includeTests}
              onChange={handleInputChange}
            />
            <span>Include Test Files</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="includeDocs"
              checked={formData.includeDocs}
              onChange={handleInputChange}
            />
            <span>Include Documentation</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !formData.description.trim()}
            style={{ flex: 1 }}
          >
            {isLoading ? (
              <>
                <span className="spinner" style={{ marginRight: '0.5rem' }} />
                Generating...
              </>
            ) : (
              '🚀 Generate SPARC Files'
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            🔄 Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
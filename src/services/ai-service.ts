import { AIResponse } from '../types';

export type AIProvider = 'openai' | 'claude';

export class AIService {
  private readonly maxPromptLength = 10000;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  constructor() {
    this.validateConfiguration();
  }

  async generateContent(prompt: string, provider: AIProvider): Promise<AIResponse> {
    try {
      // Validate input
      const validationError = this.validateInput(prompt, provider);
      if (validationError) {
        return { success: false, content: '', error: validationError };
      }

      // Optimize prompt for better results
      const optimizedPrompt = this.optimizePrompt(prompt);

      // Generate content with retry logic
      const content = await this.callAIWithRetry(optimizedPrompt, provider);

      // Validate and sanitize response
      const sanitizedContent = this.sanitizeResponse(content);

      return { success: true, content: sanitizedContent };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private validateInput(prompt: string, provider: AIProvider): string | null {
    if (!prompt || prompt.trim().length === 0) {
      return 'Prompt is required';
    }

    if (prompt.length > this.maxPromptLength) {
      return 'Prompt exceeds maximum length';
    }

    if (!['openai', 'claude'].includes(provider)) {
      return 'Unsupported AI provider';
    }

    return null;
  }

  private optimizePrompt(prompt: string): string {
    // Add SPARC methodology context
    const sparcContext = `
You are an expert in the SPARC methodology (Specification, Pseudocode, Architecture, Refinement, Completion).
Please provide detailed, practical, and actionable content that follows software engineering best practices.

User request: ${prompt}

Please provide comprehensive and well-structured content that includes:
- Clear section headers
- Actionable items
- Technical specifications
- Best practices
- Practical implementation guidance
`;

    return sparcContext.trim();
  }

  private async callAIWithRetry(prompt: string, provider: AIProvider): Promise<string> {
    let lastError: any;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        switch (provider) {
          case 'openai':
            return await this.callOpenAI(prompt);
          case 'claude':
            return await this.callClaude(prompt);
          default:
            throw new Error(`Unsupported provider: ${provider}`);
        }
      } catch (error: any) {
        lastError = error;

        // Don't retry for certain errors
        if (error.status === 401 || error.status === 403) {
          throw error;
        }

        // If this is the last attempt, throw the error
        if (attempt === this.maxRetries) {
          throw error;
        }

        // Wait before retrying with exponential backoff
        await this.delay(this.retryDelay * Math.pow(2, attempt - 1));
      }
    }

    throw lastError;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    // In test environment, return mock response
    if (process.env.NODE_ENV === 'test') {
      return this.generateMockResponse(prompt);
    }

    // This would normally use the OpenAI SDK
    // For now, return a mock response
    return this.generateMockResponse(prompt);
  }

  private async callClaude(prompt: string): Promise<string> {
    // In test environment, return mock response
    if (process.env.NODE_ENV === 'test') {
      return this.generateMockResponse(prompt);
    }

    // This would normally use the Anthropic SDK
    // For now, return a mock response
    return this.generateMockResponse(prompt);
  }

  private generateMockResponse(prompt: string): string {
    // Generate different mock responses based on prompt content
    if (prompt.includes('specification')) {
      return `# Project Specification

## Overview
This is a mock specification generated for testing purposes.

## Requirements
1. User authentication
2. Data management
3. User interface
4. API integration

## Acceptance Criteria
- Users can successfully authenticate
- Data is stored securely
- Interface is responsive
- API calls complete within 500ms`;
    }

    if (prompt.includes('architecture')) {
      return `# System Architecture

## Components
- Frontend: React application
- Backend: Node.js API server
- Database: PostgreSQL
- Cache: Redis

## Data Flow
1. User interacts with frontend
2. Frontend calls API
3. API processes request
4. Data is stored/retrieved from database
5. Response is returned to user`;
    }

    return `# Generated Content

This is mock content generated for: ${prompt.slice(0, 100)}...

## Key Points
- Comprehensive implementation
- Best practices followed
- Production-ready code
- Proper error handling
- Security considerations
- Performance optimization`;
  }

  private sanitizeResponse(content: string): string {
    if (!content) {
      throw new Error('Invalid response from AI service');
    }

    // Remove potentially harmful HTML/script tags
    return content
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  private handleError(error: any): AIResponse {
    let errorMessage = 'Unknown error occurred';

    if (error.status === 401 || error.status === 403) {
      errorMessage = 'Authentication failed - please check API keys';
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded - please try again later';
    } else if (error.status === 402) {
      errorMessage = 'Quota exceeded - please check your billing';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      content: '',
      error: errorMessage
    };
  }

  private validateConfiguration(): void {
    if (process.env.NODE_ENV !== 'test' && !process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
      throw new Error('Missing required API keys');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
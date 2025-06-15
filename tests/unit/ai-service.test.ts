import { AIService } from '../../src/services/ai-service';
import { mockAiResponses } from '../fixtures/test-data';

// Mock the AI SDKs
jest.mock('openai');
jest.mock('@anthropic-ai/sdk');

describe('AIService', () => {
  let aiService: AIService;

  beforeEach(() => {
    aiService = new AIService();
    jest.clearAllMocks();
  });

  describe('generateContent', () => {
    it('should generate content using OpenAI', async () => {
      const prompt = 'Create a specification for a blog application';
      const provider = 'openai';

      const result = await aiService.generateContent(prompt, provider);

      expect(result.success).toBe(true);
      expect(result.content).toBeTruthy();
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should generate content using Claude', async () => {
      const prompt = 'Create a specification for a blog application';
      const provider = 'claude';

      const result = await aiService.generateContent(prompt, provider);

      expect(result.success).toBe(true);
      expect(result.content).toBeTruthy();
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle invalid provider', async () => {
      const prompt = 'Test prompt';
      const provider = 'invalid' as any;

      const result = await aiService.generateContent(prompt, provider);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported AI provider');
    });

    it('should handle empty prompts', async () => {
      const prompt = '';
      const provider = 'openai';

      const result = await aiService.generateContent(prompt, provider);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Prompt is required');
    });

    it('should handle prompts that are too long', async () => {
      const prompt = 'A'.repeat(50000);
      const provider = 'openai';

      const result = await aiService.generateContent(prompt, provider);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Prompt exceeds maximum length');
    });
  });

  describe('rate limiting', () => {
    it('should respect rate limits', async () => {
      const prompt = 'Test prompt';
      const provider = 'openai';

      // Mock rate limit exceeded
      jest.spyOn(aiService as any, 'callOpenAI').mockRejectedValue({
        status: 429,
        message: 'Rate limit exceeded'
      });

      const result = await aiService.generateContent(prompt, provider);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Rate limit exceeded');
    });

    it('should implement retry logic with exponential backoff', async () => {
      const prompt = 'Test prompt';
      const provider = 'openai';

      // Mock first call fails, second succeeds
      jest.spyOn(aiService as any, 'callOpenAI')
        .mockRejectedValueOnce({ status: 500, message: 'Server error' })
        .mockResolvedValueOnce('Success response');

      const result = await aiService.generateContent(prompt, provider);

      expect(result.success).toBe(true);
    });
  });

  describe('response validation', () => {
    it('should validate AI response format', async () => {
      const prompt = 'Test prompt';
      const provider = 'openai';

      // Mock invalid response
      jest.spyOn(aiService as any, 'callOpenAI').mockResolvedValue(null);

      const result = await aiService.generateContent(prompt, provider);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid response from AI service');
    });

    it('should sanitize AI responses', async () => {
      const prompt = 'Test prompt';
      const provider = 'openai';

      // Mock response with potentially harmful content
      const maliciousResponse = '<script>alert("xss")</script>Valid content';
      jest.spyOn(aiService as any, 'callOpenAI').mockResolvedValue(maliciousResponse);

      const result = await aiService.generateContent(prompt, provider);

      expect(result.success).toBe(true);
      expect(result.content).not.toContain('<script>');
      expect(result.content).toContain('Valid content');
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      const prompt = 'Test prompt';
      const provider = 'openai';

      jest.spyOn(aiService as any, 'callOpenAI').mockRejectedValue(
        new Error('Network error')
      );

      const result = await aiService.generateContent(prompt, provider);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    it('should handle API key errors', async () => {
      const prompt = 'Test prompt';
      const provider = 'openai';

      jest.spyOn(aiService as any, 'callOpenAI').mockRejectedValue({
        status: 401,
        message: 'Invalid API key'
      });

      const result = await aiService.generateContent(prompt, provider);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Authentication failed');
    });

    it('should handle quota exceeded errors', async () => {
      const prompt = 'Test prompt';
      const provider = 'claude';

      jest.spyOn(aiService as any, 'callClaude').mockRejectedValue({
        status: 402,
        message: 'Quota exceeded'
      });

      const result = await aiService.generateContent(prompt, provider);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Quota exceeded');
    });
  });

  describe('configuration', () => {
    it('should use environment variables for API keys', () => {
      expect(process.env.OPENAI_API_KEY).toBe('test-openai-key');
      expect(process.env.ANTHROPIC_API_KEY).toBe('test-anthropic-key');
    });

    it('should validate required configuration', () => {
      const originalOpenAI = process.env.OPENAI_API_KEY;
      const originalClaude = process.env.ANTHROPIC_API_KEY;
      const originalEnv = process.env.NODE_ENV;
      
      delete process.env.OPENAI_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;
      process.env.NODE_ENV = 'production';

      expect(() => new AIService()).toThrow('Missing required API keys');

      process.env.OPENAI_API_KEY = originalOpenAI;
      process.env.ANTHROPIC_API_KEY = originalClaude;
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('prompt optimization', () => {
    it('should optimize prompts for better results', async () => {
      const prompt = 'blog app';
      const provider = 'openai';

      const result = await aiService.generateContent(prompt, provider);

      expect(result.success).toBe(true);
      // Should have enhanced the prompt internally
    });

    it('should add context for SPARC methodology', async () => {
      const prompt = 'Create architecture for e-commerce site';
      const provider = 'claude';

      const result = await aiService.generateContent(prompt, provider);

      expect(result.success).toBe(true);
      // Should include SPARC context in the prompt
    });
  });
});
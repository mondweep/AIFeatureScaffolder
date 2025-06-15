import { InputProcessor } from '../../src/services/input-processor';
import { mockUserInput, mockErrors } from '../fixtures/test-data';

describe('InputProcessor', () => {
  let inputProcessor: InputProcessor;

  beforeEach(() => {
    inputProcessor = new InputProcessor();
  });

  describe('validateInput', () => {
    it('should accept valid simple input', () => {
      const result = inputProcessor.validateInput(mockUserInput.simple);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept valid complex input', () => {
      const result = inputProcessor.validateInput(mockUserInput.complex);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty input', () => {
      const result = inputProcessor.validateInput(mockUserInput.empty);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Input is required');
    });

    it('should reject input that is too short', () => {
      const result = inputProcessor.validateInput('hi');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Input must be at least 10 characters');
    });

    it('should handle oversized input', () => {
      const result = inputProcessor.validateInput(mockUserInput.oversized);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Input exceeds maximum length of 10000 characters');
    });

    it('should sanitize potentially harmful input', () => {
      const maliciousInput = '<script>alert("xss")</script>Create a web app';
      const result = inputProcessor.validateInput(maliciousInput);
      expect(result.sanitizedInput).not.toContain('<script>');
      expect(result.sanitizedInput).toContain('Create a web app');
    });
  });

  describe('extractEntities', () => {
    it('should extract features from simple input', () => {
      const entities = inputProcessor.extractEntities(mockUserInput.simple);
      expect(entities.features).toContain('blog application');
      expect(entities.features).toContain('user authentication');
    });

    it('should extract technologies from technical input', () => {
      const entities = inputProcessor.extractEntities(mockUserInput.technical);
      expect(entities.technologies).toContain('Node.js');
      expect(entities.technologies).toContain('PostgreSQL');
      expect(entities.technologies).toContain('Redis');
      expect(entities.technologies).toContain('Docker');
    });

    it('should extract requirements from complex input', () => {
      const entities = inputProcessor.extractEntities(mockUserInput.complex);
      expect(entities.requirements).toContain('user registration');
      expect(entities.requirements).toContain('product catalog');
      expect(entities.requirements).toContain('payment processing');
    });

    it('should identify constraints and limitations', () => {
      const entities = inputProcessor.extractEntities(mockUserInput.technical);
      expect(entities.constraints).toContain('< 10ms latency');
      expect(entities.constraints).toContain('Multi-factor authentication');
    });

    it('should handle minimal input gracefully', () => {
      const entities = inputProcessor.extractEntities(mockUserInput.minimal);
      expect(entities.features).toContain('todo app');
      expect(entities.technologies).toHaveLength(0);
    });
  });

  describe('categorizeProject', () => {
    it('should categorize web application projects', () => {
      const category = inputProcessor.categorizeProject(mockUserInput.simple);
      expect(category.type).toBe('web-application');
      expect(category.complexity).toBe('medium');
    });

    it('should categorize complex projects', () => {
      const category = inputProcessor.categorizeProject(mockUserInput.complex);
      expect(category.type).toBe('e-commerce');
      expect(category.complexity).toBe('high');
    });

    it('should categorize technical projects', () => {
      const category = inputProcessor.categorizeProject(mockUserInput.technical);
      expect(category.type).toBe('microservices');
      expect(category.complexity).toBe('enterprise');
    });

    it('should categorize simple projects', () => {
      const category = inputProcessor.categorizeProject(mockUserInput.minimal);
      expect(category.type).toBe('utility');
      expect(category.complexity).toBe('low');
    });
  });

  describe('generateStructuredSpec', () => {
    it('should generate structured specification from input', async () => {
      const spec = await inputProcessor.generateStructuredSpec(mockUserInput.simple);
      
      expect(spec).toHaveProperty('projectName');
      expect(spec).toHaveProperty('description');
      expect(spec).toHaveProperty('features');
      expect(spec).toHaveProperty('technologies');
      expect(spec).toHaveProperty('requirements');
      expect(spec).toHaveProperty('constraints');
      expect(spec).toHaveProperty('acceptanceCriteria');
      
      expect(spec.features).toBeInstanceOf(Array);
      expect(spec.features.length).toBeGreaterThan(0);
    });

    it('should include estimated timeline', async () => {
      const spec = await inputProcessor.generateStructuredSpec(mockUserInput.complex);
      expect(spec).toHaveProperty('estimatedTimeline');
      expect(spec.estimatedTimeline).toHaveProperty('phases');
      expect(spec.estimatedTimeline.totalWeeks).toBeGreaterThan(0);
    });

    it('should suggest appropriate technologies', async () => {
      const spec = await inputProcessor.generateStructuredSpec(mockUserInput.simple);
      expect(spec.technologies.suggested).toContain('React');
      expect(spec.technologies.suggested).toContain('Node.js');
    });
  });

  describe('error handling', () => {
    it('should handle processing errors gracefully', async () => {
      // Mock internal method to throw error
      jest.spyOn(inputProcessor, 'extractEntities').mockImplementation(() => {
        throw new Error('Processing failed');
      });

      await expect(inputProcessor.generateStructuredSpec(mockUserInput.simple))
        .rejects.toThrow('Failed to process input');
    });

    it('should validate input encoding', () => {
      const invalidInput = Buffer.from([0xFF, 0xFE]).toString();
      const result = inputProcessor.validateInput(invalidInput);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid character encoding detected');
    });
  });
});
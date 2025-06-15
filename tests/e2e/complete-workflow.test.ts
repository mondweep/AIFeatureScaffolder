import { InputProcessor } from '../../src/services/input-processor';
import { SparcGenerator } from '../../src/services/sparc-generator';
import { AIService } from '../../src/services/ai-service';
import { mockUserInput } from '../fixtures/test-data';

describe('Complete Workflow E2E', () => {
  let inputProcessor: InputProcessor;
  let sparcGenerator: SparcGenerator;
  let aiService: AIService;

  beforeEach(() => {
    inputProcessor = new InputProcessor();
    aiService = new AIService();
    sparcGenerator = new SparcGenerator(aiService);
  });

  describe('Simple Blog Application Workflow', () => {
    it('should complete full workflow from input to SPARC files', async () => {
      const userInput = mockUserInput.simple;

      // Step 1: Validate and process input
      const validation = inputProcessor.validateInput(userInput);
      expect(validation.isValid).toBe(true);

      // Step 2: Extract entities and generate structured spec
      const entities = inputProcessor.extractEntities(userInput);
      expect(entities.features).toContain('blog application');
      expect(entities.features).toContain('user authentication');

      const spec = await inputProcessor.generateStructuredSpec(userInput);
      expect(spec.projectName).toBe('Blog Application');
      expect(spec.features.length).toBeGreaterThan(0);

      // Step 3: Generate SPARC documentation
      const sparcFiles = await sparcGenerator.generateAllPhases(spec);
      expect(sparcFiles).toHaveLength(5);

      // Step 4: Verify each SPARC phase
      const phaseNames = ['specification', 'pseudocode', 'architecture', 'refinement', 'completion'];
      phaseNames.forEach((phaseName, index) => {
        const file = sparcFiles[index];
        expect(file.phase).toBe(phaseName);
        expect(file.content).toContain(`# Phase ${index + 1}:`);
        expect(file.content.length).toBeGreaterThan(100);
        expect(file.metadata.projectName).toBe('Blog Application');
      });

      // Step 5: Verify content quality
      const specFile = sparcFiles[0];
      expect(specFile.content).toContain('Project Overview');
      expect(specFile.content).toContain('Functional Requirements');

      const archFile = sparcFiles[2];
      expect(archFile.content).toContain('System Architecture');
      expect(archFile.content).toContain('Component Structure');

      // Step 6: Verify metadata consistency
      sparcFiles.forEach(file => {
        expect(file.metadata.generatedAt).toBeTruthy();
        expect(file.metadata.projectName).toBe(spec.projectName);
        expect(file.metadata.technologies).toEqual(spec.technologies.suggested);
      });
    });
  });

  describe('Complex E-commerce Workflow', () => {
    it('should handle complex projects with appropriate detail', async () => {
      const userInput = mockUserInput.complex;

      // Process complex input
      const validation = inputProcessor.validateInput(userInput);
      expect(validation.isValid).toBe(true);

      const spec = await inputProcessor.generateStructuredSpec(userInput);
      expect(spec.projectName).toBe('E-commerce Platform');

      const sparcFiles = await sparcGenerator.generateAllPhases(spec);

      // Complex projects should have more detailed architecture
      const archFile = sparcFiles.find(f => f.phase === 'architecture');
      expect(archFile?.content).toContain('Architecture');
      expect(archFile?.content).toContain('database');

      // Should include appropriate complexity assessment
      expect(archFile?.metadata.complexity).toBe('high');

      // Should have comprehensive requirements
      const specFile = sparcFiles.find(f => f.phase === 'specification');
      expect(specFile?.content).toContain('user registration');
      expect(specFile?.content).toContain('product catalog');
      expect(specFile?.content).toContain('payment processing');
    });
  });

  describe('Technical Project Workflow', () => {
    it('should preserve technical requirements and constraints', async () => {
      const userInput = mockUserInput.technical;

      const validation = inputProcessor.validateInput(userInput);
      expect(validation.isValid).toBe(true);

      const entities = inputProcessor.extractEntities(userInput);
      expect(entities.technologies).toContain('Node.js');
      expect(entities.technologies).toContain('PostgreSQL');
      expect(entities.constraints).toContain('< 10ms latency');

      const spec = await inputProcessor.generateStructuredSpec(userInput);
      const sparcFiles = await sparcGenerator.generateAllPhases(spec);

      // Technical constraints should appear in architecture
      const archFile = sparcFiles.find(f => f.phase === 'architecture');
      expect(archFile?.content).toContain('Node.js');
      expect(archFile?.content).toContain('PostgreSQL');

      // Performance requirements should be in refinement phase
      const refineFile = sparcFiles.find(f => f.phase === 'refinement');
      expect(refineFile?.content).toContain('Performance Optimization');
    });
  });

  describe('Error Handling Workflows', () => {
    it('should handle invalid input gracefully', async () => {
      const invalidInput = mockUserInput.empty;

      const validation = inputProcessor.validateInput(invalidInput);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Input is required');

      // Should not proceed with invalid input
      try {
        await inputProcessor.generateStructuredSpec(invalidInput);
        fail('Should have thrown error for empty input');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle oversized input appropriately', async () => {
      const oversizedInput = mockUserInput.oversized;

      const validation = inputProcessor.validateInput(oversizedInput);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Input exceeds maximum length of 10000 characters');
    });

    it('should sanitize malicious input', async () => {
      const maliciousInput = '<script>alert("xss")</script>Create a secure web application';

      const validation = inputProcessor.validateInput(maliciousInput);
      expect(validation.sanitizedInput).not.toContain('<script>');
      expect(validation.sanitizedInput).toContain('Create a secure web application');

      if (validation.isValid) {
        const spec = await inputProcessor.generateStructuredSpec(validation.sanitizedInput!);
        expect(spec.description).not.toContain('<script>');
      }
    });
  });

  describe('AI Service Integration', () => {
    it('should successfully use AI service for content generation', async () => {
      const prompt = 'Generate specification for a todo application';

      const openaiResult = await aiService.generateContent(prompt, 'openai');
      expect(openaiResult.success).toBe(true);
      expect(openaiResult.content).toBeTruthy();

      const claudeResult = await aiService.generateContent(prompt, 'claude');
      expect(claudeResult.success).toBe(true);
      expect(claudeResult.content).toBeTruthy();
    });

    it('should handle AI service errors gracefully', async () => {
      const result = await aiService.generateContent('', 'openai');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Prompt is required');
    });
  });

  describe('Performance and Scalability', () => {
    it('should process multiple requests efficiently', async () => {
      const inputs = [
        mockUserInput.simple,
        mockUserInput.minimal,
        'Create a calculator app'
      ];

      const startTime = Date.now();

      const promises = inputs.map(async (input) => {
        const validation = inputProcessor.validateInput(input);
        if (validation.isValid) {
          const spec = await inputProcessor.generateStructuredSpec(input);
          return sparcGenerator.generateAllPhases(spec);
        }
        return [];
      });

      const results = await Promise.all(promises);
      const endTime = Date.now();

      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(5000);

      // All results should be valid
      results.forEach(sparcFiles => {
        if (sparcFiles.length > 0) {
          expect(sparcFiles).toHaveLength(5);
          sparcFiles.forEach(file => {
            expect(file.content).toBeTruthy();
            expect(file.metadata).toBeDefined();
          });
        }
      });
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency across all phases', async () => {
      const userInput = mockUserInput.technical;

      const spec = await inputProcessor.generateStructuredSpec(userInput);
      const sparcFiles = await sparcGenerator.generateAllPhases(spec);

      // Extract project name from each file
      const projectNames = sparcFiles.map(file => file.metadata.projectName);
      const uniqueNames = [...new Set(projectNames)];
      expect(uniqueNames).toHaveLength(1);

      // Technologies should be consistent
      sparcFiles.forEach(file => {
        expect(file.metadata.technologies).toEqual(spec.technologies.suggested);
      });

      // Phase numbers should be sequential
      sparcFiles.forEach((file, index) => {
        expect(file.content).toContain(`# Phase ${index + 1}:`);
      });
    });
  });
});
import { SparcGenerator } from '../../src/services/sparc-generator';
import { InputProcessor } from '../../src/services/input-processor';
import { AIService } from '../../src/services/ai-service';
import { mockUserInput, mockSparcFiles } from '../fixtures/test-data';

describe('SparcGenerator Integration', () => {
  let sparcGenerator: SparcGenerator;
  let inputProcessor: InputProcessor;
  let aiService: AIService;

  beforeEach(() => {
    inputProcessor = new InputProcessor();
    aiService = new AIService();
    sparcGenerator = new SparcGenerator(aiService);
  });

  describe('generateAllPhases', () => {
    it('should generate complete SPARC documentation', async () => {
      const spec = await inputProcessor.generateStructuredSpec(mockUserInput.simple);
      const sparcFiles = await sparcGenerator.generateAllPhases(spec);

      expect(sparcFiles).toHaveLength(5);
      expect(sparcFiles[0].phase).toBe('specification');
      expect(sparcFiles[1].phase).toBe('pseudocode');
      expect(sparcFiles[2].phase).toBe('architecture');
      expect(sparcFiles[3].phase).toBe('refinement');
      expect(sparcFiles[4].phase).toBe('completion');

      sparcFiles.forEach(file => {
        expect(file.content).toBeTruthy();
        expect(file.content.length).toBeGreaterThan(100);
        expect(file.metadata).toBeDefined();
      });
    });

    it('should handle complex projects appropriately', async () => {
      const spec = await inputProcessor.generateStructuredSpec(mockUserInput.complex);
      const sparcFiles = await sparcGenerator.generateAllPhases(spec);

      expect(sparcFiles).toHaveLength(5);
      
      // Complex projects should have more detailed content
      const architectureFile = sparcFiles.find(f => f.phase === 'architecture');
      expect(architectureFile?.content).toContain('Architecture');
      expect(architectureFile?.content).toContain('database');
    });

    it('should maintain consistency across phases', async () => {
      const spec = await inputProcessor.generateStructuredSpec(mockUserInput.technical);
      const sparcFiles = await sparcGenerator.generateAllPhases(spec);

      const specFile = sparcFiles.find(f => f.phase === 'specification');
      const archFile = sparcFiles.find(f => f.phase === 'architecture');

      // Technology mentioned in spec should appear in architecture
      expect(specFile?.content).toContain('Node.js');
      expect(archFile?.content).toContain('Node.js');

      expect(specFile?.content).toContain('PostgreSQL');
      expect(archFile?.content).toContain('PostgreSQL');
    });
  });

  describe('generatePhase', () => {
    it('should generate specific phase with proper context', async () => {
      const spec = await inputProcessor.generateStructuredSpec(mockUserInput.simple);
      const architectureFile = await sparcGenerator.generatePhase('architecture', spec);

      expect(architectureFile.phase).toBe('architecture');
      expect(architectureFile.content).toContain('# Phase 3: Architecture');
      expect(architectureFile.content).toContain('System Architecture');
      expect(architectureFile.metadata.projectName).toBe(spec.projectName);
    });

    it('should include relevant technologies in architecture phase', async () => {
      const spec = await inputProcessor.generateStructuredSpec(mockUserInput.technical);
      const architectureFile = await sparcGenerator.generatePhase('architecture', spec);

      spec.technologies.suggested.forEach(tech => {
        expect(architectureFile.content).toContain(tech);
      });
    });
  });

  describe('error handling', () => {
    it('should handle AI service failures gracefully', async () => {
      const spec = await inputProcessor.generateStructuredSpec(mockUserInput.simple);
      
      // Mock internal method to throw error
      jest.spyOn(sparcGenerator as any, 'generatePhaseContent').mockRejectedValue(new Error('AI service failed'));

      await expect(sparcGenerator.generateAllPhases(spec))
        .rejects.toThrow('Failed to generate SPARC documentation');
    });

    it('should validate phase names', async () => {
      const spec = await inputProcessor.generateStructuredSpec(mockUserInput.simple);

      await expect(sparcGenerator.generatePhase('invalid-phase' as any, spec))
        .rejects.toThrow('Invalid phase name');
    });
  });

  describe('file output validation', () => {
    it('should generate files with proper markdown structure', async () => {
      const spec = await inputProcessor.generateStructuredSpec(mockUserInput.simple);
      const sparcFiles = await sparcGenerator.generateAllPhases(spec);

      sparcFiles.forEach(file => {
        expect(file.content).toMatch(/^# Phase \d+:/);
        expect(file.content).toContain('##');
        expect(file.content.length).toBeGreaterThan(50);
      });
    });

    it('should include metadata for tracking', async () => {
      const spec = await inputProcessor.generateStructuredSpec(mockUserInput.simple);
      const sparcFiles = await sparcGenerator.generateAllPhases(spec);

      sparcFiles.forEach(file => {
        expect(file.metadata).toHaveProperty('generatedAt');
        expect(file.metadata).toHaveProperty('projectName');  
        expect(file.metadata).toHaveProperty('complexity');
        expect(typeof file.metadata.generatedAt).toBe('string');
      });
    });
  });
});
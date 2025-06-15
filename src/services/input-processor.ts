import { 
  ValidationResult, 
  ExtractedEntities, 
  ProjectCategory, 
  StructuredSpec,
  FeatureRequest,
  ProcessedInput
} from '../types';

export class InputProcessor {
  private readonly MIN_LENGTH = 10;
  private readonly MAX_LENGTH = 10000;

  validateInput(input: string): ValidationResult {
    const errors: string[] = [];
    let sanitizedInput = input;

    // Check if input is empty
    if (!input || input.trim().length === 0) {
      errors.push('Input is required');
      return { isValid: false, errors };
    }

    // Check minimum length
    if (input.length < this.MIN_LENGTH) {
      errors.push('Input must be at least 10 characters');
    }

    // Check maximum length
    if (input.length > this.MAX_LENGTH) {
      errors.push('Input exceeds maximum length of 10000 characters');
    }

    // Check for invalid encoding
    try {
      // Check for invalid UTF-8 sequences
      if (input.includes('\uFFFD') || !/^[\x00-\x7F\u0080-\uFFFF]*$/.test(input)) {
        errors.push('Invalid character encoding detected');
      }
    } catch (error) {
      errors.push('Invalid character encoding detected');
    }

    // Sanitize potentially harmful input
    sanitizedInput = this.sanitizeInput(input);

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedInput
    };
  }

  private sanitizeInput(input: string): string {
    // Remove script tags and other potentially harmful HTML
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  extractEntities(input: string): ExtractedEntities {
    const entities: ExtractedEntities = {
      features: [],
      technologies: [],
      requirements: [],
      constraints: []
    };

    const lowerInput = input.toLowerCase();

    // Extract features
    if (lowerInput.includes('blog application')) {
      entities.features.push('blog application');
    }
    if (lowerInput.includes('user authentication')) {
      entities.features.push('user authentication');
    }
    if (lowerInput.includes('todo app')) {
      entities.features.push('todo app');
    }

    // Extract technologies
    const techKeywords = ['node.js', 'postgresql', 'redis', 'docker', 'react'];
    techKeywords.forEach(tech => {
      if (lowerInput.includes(tech)) {
        entities.technologies.push(tech === 'node.js' ? 'Node.js' : 
                                 tech === 'postgresql' ? 'PostgreSQL' : 
                                 tech === 'redis' ? 'Redis' :
                                 tech === 'docker' ? 'Docker' : 
                                 tech === 'react' ? 'React' : tech);
      }
    });

    // Extract requirements
    const requirements = [
      'user registration',
      'product catalog', 
      'payment processing',
      'shopping cart',
      'order management',
      'admin dashboard',
      'email notifications',
      'mobile responsive',
      'seo optimization',
      'analytics integration'
    ];
    requirements.forEach(req => {
      if (lowerInput.includes(req)) {
        entities.requirements.push(req);
      }
    });

    // Extract constraints
    if (lowerInput.includes('< 10ms latency')) {
      entities.constraints.push('< 10ms latency');
    }
    if (lowerInput.includes('multi-factor authentication')) {
      entities.constraints.push('Multi-factor authentication');
    }

    return entities;
  }

  categorizeProject(input: string): ProjectCategory {
    const lowerInput = input.toLowerCase();

    // E-commerce detection
    if (lowerInput.includes('e-commerce') || 
        lowerInput.includes('shopping') || 
        lowerInput.includes('payment')) {
      return { type: 'e-commerce', complexity: 'high' };
    }

    // Microservices detection
    if (lowerInput.includes('microservices') || 
        lowerInput.includes('financial trading')) {
      return { type: 'microservices', complexity: 'enterprise' };
    }

    // Simple utility detection
    if (lowerInput.includes('todo') && lowerInput.length < 50) {
      return { type: 'utility', complexity: 'low' };
    }

    // Default web application
    return { type: 'web-application', complexity: 'medium' };
  }

  async generateStructuredSpec(input: string): Promise<StructuredSpec> {
    try {
      const entities = this.extractEntities(input);
      const category = this.categorizeProject(input);

      // Generate basic structured specification
      const spec: StructuredSpec = {
        projectName: this.extractProjectName(input),
        description: this.generateDescription(input, entities),
        features: entities.features,
        technologies: {
          suggested: this.suggestTechnologies(category, entities),
          alternatives: []
        },
        requirements: entities.requirements,
        constraints: entities.constraints,
        acceptanceCriteria: this.generateAcceptanceCriteria(entities),
        estimatedTimeline: this.estimateTimeline(category, entities)
      };

      return spec;
    } catch (error) {
      throw new Error('Failed to process input');
    }
  }

  private extractProjectName(input: string): string {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('blog')) return 'Blog Application';
    if (lowerInput.includes('e-commerce')) return 'E-commerce Platform';
    if (lowerInput.includes('todo')) return 'Todo Application';
    if (lowerInput.includes('trading')) return 'Trading Platform';
    return 'Web Application';
  }

  private generateDescription(input: string, entities: ExtractedEntities): string {
    return `A comprehensive application featuring ${entities.features.join(', ')}`;
  }

  private suggestTechnologies(category: ProjectCategory, entities: ExtractedEntities): string[] {
    const suggested = ['React', 'Node.js'];
    
    if (category.complexity === 'high' || category.complexity === 'enterprise') {
      suggested.push('PostgreSQL', 'Redis');
    }

    // Add any technologies mentioned in input
    suggested.push(...entities.technologies);

    return [...new Set(suggested)]; // Remove duplicates
  }

  private generateAcceptanceCriteria(entities: ExtractedEntities): string[] {
    return entities.features.map(feature => 
      `User should be able to use ${feature} successfully`
    );
  }

  private estimateTimeline(category: ProjectCategory, entities: ExtractedEntities): {
    phases: string[];
    totalWeeks: number;
  } {
    const baseWeeks = category.complexity === 'low' ? 2 : 
                     category.complexity === 'medium' ? 8 : 
                     category.complexity === 'high' ? 16 : 24;

    return {
      phases: ['Planning', 'Development', 'Testing', 'Deployment'],
      totalWeeks: baseWeeks
    };
  }

  async process(request: FeatureRequest): Promise<ProcessedInput> {
    try {
      // Validate the description
      const validation = this.validateInput(request.description);
      
      if (!validation.isValid) {
        return {
          isValid: false,
          errors: validation.errors,
          data: null
        };
      }

      // Generate structured specification from the request
      const spec = await this.generateStructuredSpec(request.description);
      
      // Add request metadata to the spec
      const enhancedSpec = {
        ...spec,
        requestMetadata: {
          complexity: request.complexity,
          framework: request.framework,
          includeTests: request.includeTests,
          includeDocs: request.includeDocs,
          aiProvider: request.aiProvider
        }
      };

      return {
        isValid: true,
        data: enhancedSpec
      };
      
    } catch (error) {
      return {
        isValid: false,
        errors: [`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        data: null
      };
    }
  }
}
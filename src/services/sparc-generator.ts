import { StructuredSpec, SparcFile, SparcOutput, GeneratedFile } from '../types';
import { AIService } from './ai-service';

export type SparcPhase = 'specification' | 'pseudocode' | 'architecture' | 'refinement' | 'completion';

export class SparcGenerator {
  private readonly validPhases: SparcPhase[] = [
    'specification', 'pseudocode', 'architecture', 'refinement', 'completion'
  ];

  constructor(private aiService: AIService) {}

  async generateAllPhases(spec: StructuredSpec): Promise<SparcFile[]> {
    try {
      const sparcFiles: SparcFile[] = [];

      for (const phase of this.validPhases) {
        const file = await this.generatePhase(phase, spec);
        sparcFiles.push(file);
      }

      return sparcFiles;
    } catch (error) {
      throw new Error('Failed to generate SPARC documentation');
    }
  }

  async generatePhase(phase: SparcPhase, spec: StructuredSpec): Promise<SparcFile> {
    if (!this.validPhases.includes(phase)) {
      throw new Error('Invalid phase name');
    }

    const content = await this.generatePhaseContent(phase, spec);
    
    return {
      phase,
      content,
      metadata: {
        generatedAt: new Date().toISOString(),
        projectName: spec.projectName,
        complexity: this.determineComplexity(spec),
        phase,
        technologies: spec.technologies.suggested
      }
    };
  }

  private async generatePhaseContent(phase: SparcPhase, spec: StructuredSpec): Promise<string> {
    const phaseNumber = this.validPhases.indexOf(phase) + 1;
    const phaseTitle = this.getPhaseTitle(phase);

    switch (phase) {
      case 'specification':
        return this.generateSpecificationContent(phaseNumber, spec);
      case 'pseudocode':
        return this.generatePseudocodeContent(phaseNumber, spec);
      case 'architecture':
        return this.generateArchitectureContent(phaseNumber, spec);
      case 'refinement':
        return this.generateRefinementContent(phaseNumber, spec);
      case 'completion':
        return this.generateCompletionContent(phaseNumber, spec);
      default:
        throw new Error(`Unknown phase: ${phase}`);
    }
  }

  private generateSpecificationContent(phaseNumber: number, spec: StructuredSpec): string {
    return `# Phase ${phaseNumber}: Specification - ${spec.projectName}

## Project Overview
${spec.description}

## Technology Stack
${spec.technologies.suggested.map(tech => `- ${tech}`).join('\n')}

## Core Functional Requirements
${spec.features.map((feature, index) => `### FR${index + 1}: ${feature}
- Implementation of ${feature}
- User interface components
- Backend service integration`).join('\n\n')}

## Non-Functional Requirements
${spec.requirements.map(req => `- ${req}`).join('\n')}

## Technical Constraints
${spec.constraints.map(constraint => `- ${constraint}`).join('\n')}

## Acceptance Criteria
${spec.acceptanceCriteria.map((criteria, index) => `${index + 1}. ${criteria}`).join('\n')}

## Success Metrics
- User satisfaction rating > 4.0/5.0
- System uptime > 99.9%
- Response time < 200ms for critical operations
- Security compliance with industry standards
`;
  }

  private generatePseudocodeContent(phaseNumber: number, spec: StructuredSpec): string {
    return `# Phase ${phaseNumber}: Pseudocode - ${spec.projectName}

## Core Algorithm Design

${spec.features.map(feature => `### ${feature} Flow
\`\`\`
FUNCTION handle${feature.replace(/\s+/g, '')}():
  BEGIN
    VALIDATE user input
    AUTHENTICATE user session
    PROCESS business logic
    UPDATE data store
    RETURN success response
  END
\`\`\`
`).join('\n')}

## Data Structures
\`\`\`
STRUCTURE User:
  id: INTEGER
  username: STRING
  email: STRING
  createdAt: TIMESTAMP
  
STRUCTURE ${spec.projectName.replace(/\s+/g, '')}Data:
  id: INTEGER
  userId: INTEGER (FK)
  content: JSON
  updatedAt: TIMESTAMP
\`\`\`

## Error Handling
\`\`\`
FUNCTION handleError(error):
  LOG error details
  IF error.type == "VALIDATION":
    RETURN user-friendly message
  ELSE IF error.type == "AUTH":
    REDIRECT to login
  ELSE:
    RETURN generic error message
\`\`\`
`;
  }

  private generateArchitectureContent(phaseNumber: number, spec: StructuredSpec): string {
    const hasDatabase = spec.technologies.suggested.some(tech => 
      ['PostgreSQL', 'MySQL', 'MongoDB'].includes(tech)
    );
    const hasCache = spec.technologies.suggested.includes('Redis');
    const complexity = this.determineComplexity(spec);
    const isComplex = complexity === 'high' || spec.requirements.length > 3;

    let architectureContent = `# Phase ${phaseNumber}: Architecture - ${spec.projectName}

## System Architecture
\`\`\`
Frontend (${spec.technologies.suggested.find(t => ['React', 'Vue', 'Angular'].includes(t)) || 'React'})
    ↓
API Gateway
    ↓`;

    if (isComplex) {
      architectureContent += `
Microservices Architecture
    ├── Auth Service
    ├── Core Service
    └── Notification Service`;
    } else {
      architectureContent += `
Backend Service (${spec.technologies.suggested.find(t => ['Node.js', 'Express'].includes(t)) || 'Node.js'})`;
    }

    if (hasCache) {
      architectureContent += `
    ↓
Cache Layer (Redis)`;
    }

    if (hasDatabase) {
      const dbTech = spec.technologies.suggested.find(t => 
        ['PostgreSQL', 'MySQL', 'MongoDB'].includes(t)
      ) || 'PostgreSQL';
      architectureContent += `
    ↓
Database (${dbTech})`;
    }

    architectureContent += `
\`\`\`

## Component Structure
${spec.technologies.suggested.map(tech => `- ${tech}: ${this.getTechnologyDescription(tech)}`).join('\n')}

## Security Architecture
- Authentication: JWT tokens with refresh mechanism
- Authorization: Role-based access control (RBAC)
- Data encryption: AES-256 for sensitive data
- API security: Rate limiting, input validation, CORS

## Scalability Considerations
- Horizontal scaling capability
- Database connection pooling
- Caching strategy for frequently accessed data
- Load balancing across service instances
`;

    return architectureContent;
  }

  private generateRefinementContent(phaseNumber: number, spec: StructuredSpec): string {
    return `# Phase ${phaseNumber}: Refinement - ${spec.projectName}

## Test-Driven Development Plan
1. Write unit tests for core business logic
2. Create integration tests for API endpoints
3. Develop end-to-end tests for user workflows
4. Implement components to pass tests
5. Refactor for performance and maintainability

## Testing Strategy
### Unit Tests (Target: 90% coverage)
${spec.features.map(feature => `- ${feature} service tests
- ${feature} validation tests
- ${feature} error handling tests`).join('\n')}

### Integration Tests
${spec.features.map(feature => `- ${feature} API endpoint tests
- ${feature} database interaction tests`).join('\n')}

### End-to-End Tests
${spec.features.map(feature => `- ${feature} user workflow tests`).join('\n')}

## Performance Optimization
- Database query optimization
- Implement caching for frequently accessed data
- API response compression
- Frontend bundle optimization
- Image and asset optimization

## Code Quality Standards
- ESLint configuration for consistent code style
- Prettier for automatic code formatting
- TypeScript for type safety
- Code review process requirements
- Pre-commit hooks for quality checks

## Monitoring and Logging
- Application performance monitoring (APM)
- Error tracking and alerting
- User activity analytics
- System health metrics
- Audit trail for critical operations
`;
  }

  private generateCompletionContent(phaseNumber: number, spec: StructuredSpec): string {
    return `# Phase ${phaseNumber}: Completion - ${spec.projectName}

## Deployment Strategy
### Environment Setup
- Development: Local development with hot reload
- Staging: Production-like environment for testing
- Production: High-availability deployment

### CI/CD Pipeline
1. Code commit triggers automated tests
2. Build and package application
3. Deploy to staging environment
4. Run integration and E2E tests
5. Deploy to production with blue-green strategy

### Infrastructure
- Containerization with Docker
- Orchestration with Kubernetes (if complex) or Docker Compose
- Cloud deployment (AWS/Azure/GCP)
- Database backup and recovery procedures

## Documentation
### Technical Documentation
- API documentation with OpenAPI/Swagger
- Database schema documentation
- Architecture decision records (ADRs)
- Deployment and operations guide

### User Documentation
- User guide for ${spec.projectName.toLowerCase()}
- FAQ and troubleshooting guide
- Feature tutorials and walkthroughs
- Getting started guide

## Maintenance and Support
### Monitoring
- Application performance metrics
- Error rate monitoring
- User engagement analytics
- System resource utilization

### Updates and Maintenance
- Regular security updates
- Feature enhancement roadmap
- Bug fix prioritization process
- User feedback integration

## Success Criteria Validation
${spec.acceptanceCriteria.map((criteria, index) => `${index + 1}. ✅ ${criteria}`).join('\n')}

## Project Handover
- Code repository access and permissions
- Documentation and knowledge transfer
- Support contact information
- Maintenance schedule and procedures
`;
  }

  private getPhaseTitle(phase: SparcPhase): string {
    const titles = {
      specification: 'Specification',
      pseudocode: 'Pseudocode',
      architecture: 'Architecture',
      refinement: 'Refinement',
      completion: 'Completion'
    };
    return titles[phase];
  }

  private determineComplexity(spec: StructuredSpec): string {
    const featureCount = spec.features.length;
    const hasComplexFeatures = spec.requirements.length > 3 || spec.constraints.length > 1;
    
    if (featureCount <= 2 && !hasComplexFeatures) return 'low';
    if (featureCount <= 5 && !hasComplexFeatures) return 'medium';
    return 'high';
  }

  private getTechnologyDescription(tech: string): string {
    const descriptions: Record<string, string> = {
      'React': 'Frontend user interface framework',
      'Node.js': 'Backend JavaScript runtime',
      'PostgreSQL': 'Relational database management system',
      'Redis': 'In-memory data structure store for caching',
      'Docker': 'Containerization platform',
      'Express': 'Web application framework for Node.js'
    };
    return descriptions[tech] || 'Technology component';
  }

  private async callAiService(prompt: string): Promise<string> {
    // This would normally call an AI service
    // For testing, we'll return mock content
    return `Generated content for: ${prompt}`;
  }

  async generate(spec: any): Promise<Omit<SparcOutput, 'generationTime' | 'timestamp'>> {
    try {
      // Generate SPARC files
      const sparcFiles = await this.generateAllPhases(spec);
      
      // Convert SPARC files to the expected format
      const files: GeneratedFile[] = [];
      let specification = '';
      let architecture = '';

      // Generate code files based on the framework and requirements
      const framework = spec.requestMetadata?.framework || 'react';
      const includeTests = spec.requestMetadata?.includeTests || true;
      const includeDocs = spec.requestMetadata?.includeDocs || true;

      // Add SPARC documentation files
      sparcFiles.forEach(sparcFile => {
        if (sparcFile.phase === 'specification') {
          specification = sparcFile.content;
        } else if (sparcFile.phase === 'architecture') {
          architecture = sparcFile.content;
        }
        
        files.push({
          name: `${sparcFile.phase}.md`,
          content: sparcFile.content,
          type: 'documentation'
        });
      });

      // Generate framework-specific files
      const coreFiles = await this.generateFrameworkFiles(framework, spec);
      files.push(...coreFiles);

      if (includeTests) {
        const testFiles = await this.generateTestFiles(framework, spec);
        files.push(...testFiles);
      }

      if (includeDocs) {
        const docFiles = await this.generateDocumentationFiles(spec);
        files.push(...docFiles);
      }

      return {
        files,
        specification,
        architecture
      };

    } catch (error) {
      throw new Error(`SPARC generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async generateFrameworkFiles(framework: string, spec: any): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];
    
    switch (framework) {
      case 'react':
        files.push(
          {
            name: 'package.json',
            content: this.generatePackageJson(spec),
            type: 'configuration'
          },
          {
            name: 'src/App.tsx',
            content: this.generateReactApp(spec),
            type: 'component'
          },
          {
            name: 'src/components/index.ts',
            content: this.generateComponentIndex(spec),
            type: 'index'
          }
        );
        break;
      case 'vue':
        files.push(
          {
            name: 'package.json',
            content: this.generateVuePackageJson(spec),
            type: 'configuration'
          },
          {
            name: 'src/App.vue',
            content: this.generateVueApp(spec),
            type: 'component'
          }
        );
        break;
      default:
        files.push({
          name: 'index.html',
          content: this.generateVanillaIndex(spec),
          type: 'html'
        });
    }

    return files;
  }

  private async generateTestFiles(framework: string, spec: any): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];
    
    files.push({
      name: 'tests/setup.ts',
      content: this.generateTestSetup(framework),
      type: 'test'
    });

    spec.features.forEach((feature: string, index: number) => {
      files.push({
        name: `tests/${feature.toLowerCase().replace(/\s+/g, '-')}.test.ts`,
        content: this.generateFeatureTest(feature, framework),
        type: 'test'
      });
    });

    return files;
  }

  private async generateDocumentationFiles(spec: any): Promise<GeneratedFile[]> {
    return [
      {
        name: 'README.md',
        content: this.generateReadme(spec),
        type: 'documentation'
      },
      {
        name: 'CONTRIBUTING.md',
        content: this.generateContributing(),
        type: 'documentation'
      }
    ];
  }

  private generatePackageJson(spec: any): string {
    return JSON.stringify({
      name: spec.projectName.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: spec.description,
      main: 'src/index.tsx',
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test',
        eject: 'react-scripts eject'
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-scripts': '5.0.1',
        typescript: '^4.9.5'
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0'
      }
    }, null, 2);
  }

  private generateVuePackageJson(spec: any): string {
    return JSON.stringify({
      name: spec.projectName.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: spec.description,
      scripts: {
        serve: 'vue-cli-service serve',
        build: 'vue-cli-service build',
        test: 'vue-cli-service test:unit'
      },
      dependencies: {
        vue: '^3.3.0'
      },
      devDependencies: {
        '@vue/cli-service': '~5.0.0',
        typescript: '^4.9.5'
      }
    }, null, 2);
  }

  private generateReactApp(spec: any): string {
    return `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>${spec.projectName}</h1>
        <p>${spec.description}</p>
      </header>
      <main>
        {/* Features to implement: */}
        ${spec.features.map((feature: string) => `
        <section>
          <h2>${feature}</h2>
          <p>Implementation for ${feature} goes here</p>
        </section>`).join('')}
      </main>
    </div>
  );
}

export default App;`;
  }

  private generateVueApp(spec: any): string {
    return `<template>
  <div id="app">
    <header>
      <h1>${spec.projectName}</h1>
      <p>${spec.description}</p>
    </header>
    <main>
      <!-- Features to implement: -->
      ${spec.features.map((feature: string) => `
      <section>
        <h2>${feature}</h2>
        <p>Implementation for ${feature} goes here</p>
      </section>`).join('')}
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  data() {
    return {
      projectName: '${spec.projectName}',
      description: '${spec.description}'
    };
  }
});
</script>`;
  }

  private generateVanillaIndex(spec: any): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${spec.projectName}</title>
</head>
<body>
    <header>
        <h1>${spec.projectName}</h1>
        <p>${spec.description}</p>
    </header>
    <main>
        ${spec.features.map((feature: string) => `
        <section>
            <h2>${feature}</h2>
            <p>Implementation for ${feature} goes here</p>
        </section>`).join('')}
    </main>
</body>
</html>`;
  }

  private generateComponentIndex(spec: any): string {
    return `// Component exports for ${spec.projectName}
${spec.features.map((feature: string) => {
      const componentName = feature.replace(/\s+/g, '');
      return `export { default as ${componentName} } from './${componentName}';`;
    }).join('\n')}
`;
  }

  private generateTestSetup(framework: string): string {
    return `// Test setup for ${framework}
import '@testing-library/jest-dom';

// Setup test environment
beforeEach(() => {
  // Reset test state
});

afterEach(() => {
  // Cleanup after each test
});
`;
  }

  private generateFeatureTest(feature: string, framework: string): string {
    const componentName = feature.replace(/\s+/g, '');
    return `import { render, screen } from '@testing-library/react';
import { ${componentName} } from '../src/components';

describe('${feature}', () => {
  it('should render ${feature} component', () => {
    render(<${componentName} />);
    expect(screen.getByText('${feature}')).toBeInTheDocument();
  });

  it('should handle ${feature} functionality', () => {
    // Test implementation here
    expect(true).toBe(true);
  });
});
`;
  }

  private generateReadme(spec: any): string {
    return `# ${spec.projectName}

${spec.description}

## Features

${spec.features.map((feature: string) => `- ${feature}`).join('\n')}

## Technologies

${spec.technologies.suggested.map((tech: string) => `- ${tech}`).join('\n')}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start development server:
   \`\`\`bash
   npm start
   \`\`\`

3. Run tests:
   \`\`\`bash
   npm test
   \`\`\`

## Requirements

${spec.requirements.map((req: string) => `- ${req}`).join('\n')}

## Constraints

${spec.constraints.map((constraint: string) => `- ${constraint}`).join('\n')}

## License

MIT
`;
  }

  private generateContributing(): string {
    return `# Contributing Guide

Thank you for your interest in contributing!

## Development Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## Code Standards

- Follow existing code style
- Write comprehensive tests
- Update documentation
- Follow SPARC methodology

## Testing

Run the test suite before submitting:

\`\`\`bash
npm test
\`\`\`

## Questions?

Open an issue for any questions or concerns.
`;
  }
}
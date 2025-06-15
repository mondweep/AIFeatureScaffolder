export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedInput?: string;
}

export interface ExtractedEntities {
  features: string[];
  technologies: string[];
  requirements: string[];
  constraints: string[];
}

export interface ProjectCategory {
  type: string;
  complexity: string;
}

export interface EstimatedTimeline {
  phases: string[];
  totalWeeks: number;
}

export interface TechnologySuggestions {
  suggested: string[];
  alternatives: string[];
}

export interface StructuredSpec {
  projectName: string;
  description: string;
  features: string[];
  technologies: TechnologySuggestions;
  requirements: string[];
  constraints: string[];
  acceptanceCriteria: string[];
  estimatedTimeline: EstimatedTimeline;
}

export interface SparcFile {
  phase: string;
  content: string;
  metadata: Record<string, any>;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  technologies: string[];
}

export interface AIResponse {
  success: boolean;
  content: string;
  error?: string;
}

// Frontend Types
export interface FeatureRequest {
  description: string;
  complexity: 'simple' | 'medium' | 'complex';
  framework: 'react' | 'vue' | 'angular' | 'svelte' | 'vanilla';
  includeTests: boolean;
  includeDocs: boolean;
  aiProvider: 'openai' | 'anthropic' | 'google';
}

export interface GeneratedFile {
  name: string;
  content: string;
  type: string;
}

export interface SparcOutput {
  files: GeneratedFile[];
  specification?: string;
  architecture?: string;
  generationTime: number;
  timestamp: string;
}

export interface ProcessedInput {
  isValid: boolean;
  errors?: string[];
  data: any;
}
export const mockUserInput = {
  simple: "Create a simple blog application with user authentication",
  complex: `
    Create a comprehensive e-commerce platform with the following features:
    - User registration and authentication
    - Product catalog with search and filtering
    - Shopping cart functionality
    - Payment processing integration
    - Order management system
    - Admin dashboard for inventory management
    - Email notifications for orders
    - Mobile responsive design
    - SEO optimization
    - Analytics integration
  `,
  technical: `
    Build a microservices architecture for a financial trading platform:
    - Real-time market data processing
    - Order execution engine
    - Risk management system
    - User portfolio management
    - Compliance and audit trails
    - Technology stack: Node.js, PostgreSQL, Redis, Docker
    - Performance requirements: < 10ms latency
    - Security: Multi-factor authentication, encryption
  `,
  minimal: "Todo app",
  empty: "",
  invalid: "!@#$%^&*()",
  oversized: "A".repeat(50000)
};

export const mockSparcFiles = {
  requirements: `# Phase 1: Requirements Analysis - Blog Application

## Project Overview
A simple blog application with user authentication functionality.

## Core Functional Requirements
### FR1: User Authentication
- User registration with email and password
- User login/logout functionality
- Password reset capability

### FR2: Blog Management
- Create, read, update, delete blog posts
- Rich text editing capabilities
- Image upload functionality
`,
  pseudocode: `# Phase 2: Pseudocode - Blog Application

## Authentication Flow
\`\`\`
FUNCTION register(email, password, confirmPassword):
  VALIDATE email format
  VALIDATE password strength
  VALIDATE passwords match
  CHECK if user already exists
  HASH password
  SAVE user to database
  RETURN success message
\`\`\`

## Blog Post Management
\`\`\`
FUNCTION createPost(title, content, authorId):
  VALIDATE title not empty
  VALIDATE content not empty
  VALIDATE user is authenticated
  CREATE post object
  SAVE to database
  RETURN post id
\`\`\`
`,
  architecture: `# Phase 3: Architecture - Blog Application

## System Architecture
\`\`\`
Frontend (React)
    ↓
API Gateway
    ↓
Backend Services
    ├── Auth Service
    ├── Blog Service
    └── File Service
    ↓
Database (PostgreSQL)
\`\`\`

## Component Structure
- AuthController: Handle authentication endpoints
- BlogController: Handle blog CRUD operations
- UserModel: User data model
- PostModel: Blog post data model
`,
  refinement: `# Phase 4: Refinement - Blog Application

## Test-Driven Development Plan
1. Write unit tests for authentication logic
2. Write integration tests for API endpoints
3. Write e2e tests for user workflows
4. Implement features to pass tests
5. Refactor for performance and maintainability

## Performance Optimization
- Implement caching for frequently accessed posts
- Add pagination for blog list
- Optimize database queries
- Compress images automatically
`,
  completion: `# Phase 5: Completion - Blog Application

## Deployment Strategy
- Containerize application with Docker
- Set up CI/CD pipeline
- Deploy to cloud platform (AWS/Azure/GCP)
- Configure monitoring and logging

## Documentation
- API documentation with Swagger
- User guide for blog management
- Developer setup instructions
- Deployment guide
`
};

export const mockTemplates = [
  {
    id: 'web-app',
    name: 'Web Application',
    description: 'Standard web application template',
    category: 'web',
    technologies: ['React', 'Node.js', 'PostgreSQL']
  },
  {
    id: 'api-service',
    name: 'REST API Service',
    description: 'RESTful API service template',
    category: 'api',
    technologies: ['Express', 'MongoDB', 'Redis']
  },
  {
    id: 'mobile-app',
    name: 'Mobile Application',
    description: 'Cross-platform mobile app template',
    category: 'mobile',
    technologies: ['React Native', 'Firebase']
  }
];

export const mockAiResponses = {
  openai: {
    requirements: mockSparcFiles.requirements,
    pseudocode: mockSparcFiles.pseudocode,
    architecture: mockSparcFiles.architecture,
    refinement: mockSparcFiles.refinement,
    completion: mockSparcFiles.completion
  },
  claude: {
    requirements: mockSparcFiles.requirements,
    pseudocode: mockSparcFiles.pseudocode,
    architecture: mockSparcFiles.architecture,
    refinement: mockSparcFiles.refinement,
    completion: mockSparcFiles.completion
  }
};

export const mockErrors = {
  validation: {
    message: 'Validation failed',
    details: ['Input is required', 'Input must be at least 10 characters']
  },
  aiService: {
    message: 'AI service unavailable',
    code: 'SERVICE_UNAVAILABLE'
  },
  rateLimit: {
    message: 'Rate limit exceeded',
    retryAfter: 60
  },
  timeout: {
    message: 'Request timeout',
    code: 'TIMEOUT'
  }
};
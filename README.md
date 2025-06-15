# 🚀 AI Feature Scaffolder

An AI-powered web application that generates SPARC (Specification, Pseudocode, Architecture, Refinement, Completion) project files from natural language descriptions. Built with modern technologies and following Test-Driven Development principles.

## ✨ Features

- **Natural Language Processing**: Describe your project idea in plain English
- **SPARC Methodology**: Systematic approach to software development
- **Multiple AI Providers**: Support for OpenAI GPT-4, Anthropic Claude, and Google Gemini
- **Framework Flexibility**: Generate code for React, Vue, Angular, Svelte, or Vanilla JS
- **Comprehensive Output**: Complete project structure with tests and documentation
- **Real-time Generation**: Interactive web interface with live progress tracking

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Modern CSS** with CSS Grid and Flexbox
- **Responsive Design** for all device sizes

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Security middleware** (Helmet, CORS, Rate Limiting)
- **RESTful API** design

### Testing
- **Jest** for unit and integration testing
- **React Testing Library** for component testing
- **Playwright** for end-to-end testing
- **90%+ test coverage** target

### Development Tools
- **ESLint** for code quality
- **TypeScript** for type checking
- **Vite** for development server
- **Docker** support for containerization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- At least one AI service API key (OpenAI, Anthropic, or Google)

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-feature-scaffolder

# Run the interactive setup script
./start.sh
```

The startup script will:
- Install dependencies
- Create configuration files
- Run tests
- Start development servers

### 2. Manual Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env file with your API keys
# Required: At least one of these
# OPENAI_API_KEY=your_openai_key
# ANTHROPIC_API_KEY=your_anthropic_key
# GOOGLE_API_KEY=your_google_key

# Run tests
npm test

# Start development servers
npm run dev          # Frontend (port 5173)
npm run start:dev    # Backend (port 3000)
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## 🎯 How to Use

1. **Describe Your Project**: Enter a natural language description of what you want to build
   ```
   "Create a todo application with user authentication, task management, 
   categories, and due date reminders"
   ```

2. **Configure Settings**:
   - Choose complexity level (Simple, Medium, Complex)
   - Select framework (React, Vue, Angular, etc.)
   - Pick AI provider (OpenAI, Anthropic, Google)
   - Enable/disable tests and documentation

3. **Generate Files**: Click "Generate SPARC Files" and watch as AI creates:
   - **Specification**: Detailed requirements and acceptance criteria
   - **Pseudocode**: Algorithmic logic and data structures
   - **Architecture**: System design and component structure
   - **Implementation**: Framework-specific code files
   - **Tests**: Unit and integration test files
   - **Documentation**: README, contributing guides, etc.

4. **Download & Use**: Download all generated files and start coding!

## 📁 Project Structure

```
ai-feature-scaffolder/
├── src/
│   ├── components/          # React components
│   │   ├── App.tsx         # Main application component
│   │   ├── Header.tsx      # Navigation header
│   │   ├── InputForm.tsx   # Feature request form
│   │   ├── OutputDisplay.tsx # Generated files display
│   │   └── LoadingOverlay.tsx # Loading UI
│   ├── services/           # Business logic
│   │   ├── ai-service.ts   # AI provider integration
│   │   ├── input-processor.ts # Input validation and processing
│   │   └── sparc-generator.ts # SPARC file generation
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   ├── server.ts           # Express server
│   └── index.tsx           # Application entry point
├── tests/                  # Test suites
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   ├── e2e/               # End-to-end tests
│   ├── fixtures/          # Test data and mocks
│   └── helpers/           # Test utilities
├── public/                # Static assets
├── docs/                  # Project documentation
└── dist/                  # Built application (generated)
```

## 🧪 Testing

The project includes comprehensive testing at multiple levels:

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:e2e        # End-to-end tests only

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Test Coverage Targets
- **Unit Tests**: 90%+ coverage
- **Integration Tests**: API endpoints and service integration
- **E2E Tests**: Complete user workflows

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# AI Service API Keys (at least one required)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Development vs Production

**Development Mode:**
- Hot reload enabled
- Detailed error messages
- CORS allows localhost
- Source maps included

**Production Mode:**
- Optimized build
- Security headers enabled
- Error messages sanitized
- Static file serving

## 🚀 Deployment

### Using Docker

```bash
# Build Docker image
docker build -t ai-feature-scaffolder .

# Run container
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key ai-feature-scaffolder
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure API keys
3. Set up reverse proxy (nginx recommended)
4. Enable HTTPS
5. Configure monitoring and logging

## 🔒 Security Features

- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Cross-origin request control
- **Helmet.js**: Security headers
- **Environment Variables**: Secure credential management
- **Error Handling**: Safe error messages in production

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Write/update tests
5. Run the test suite: `npm test`
6. Run linting: `npm run lint`
7. Commit your changes: `git commit -m 'Add amazing feature'`
8. Push to the branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code style enforcement
- **Testing**: All new features must include tests
- **Documentation**: Update README and comments
- **SPARC Methodology**: Follow systematic development approach

## 📚 API Documentation

### Endpoints

#### `POST /api/generate`
Generate SPARC files from a feature request.

**Request Body:**
```json
{
  "description": "Create a todo application with user authentication",
  "complexity": "medium",
  "framework": "react",
  "includeTests": true,
  "includeDocs": true,
  "aiProvider": "openai"
}
```

**Response:**
```json
{
  "files": [
    {
      "name": "specification.md",
      "content": "# Phase 1: Specification...",
      "type": "documentation"
    }
  ],
  "specification": "Detailed specification content",
  "architecture": "Architecture documentation",
  "generationTime": 2500,
  "timestamp": "2023-12-01T10:30:00Z"
}
```

#### `GET /api/health`
Health check endpoint.

#### `GET /api/providers`
Get available AI providers and their status.

## 🐛 Troubleshooting

### Common Issues

**Build fails with TypeScript errors:**
```bash
npm run typecheck  # Check for type errors
```

**Tests failing:**
```bash
npm run test:coverage  # Run with detailed output
```

**API key not working:**
- Check `.env` file exists and has correct keys
- Verify API key format and permissions
- Check rate limits with AI provider

**Development server not starting:**
- Check if ports 3000 and 5173 are available
- Verify Node.js version (18+ required)
- Clear node_modules and reinstall

### Getting Help

1. Check the [documentation](docs/)
2. Search existing [issues](issues/)
3. Create a new issue with:
   - Environment details
   - Steps to reproduce
   - Expected vs actual behavior
   - Relevant logs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SPARC Methodology**: Systematic approach to software development
- **OpenAI, Anthropic, Google**: AI service providers
- **React Community**: Component library and best practices
- **Node.js Ecosystem**: Backend infrastructure
- **Testing Libraries**: Comprehensive testing tools

## 🗺️ Roadmap

### Near Term (v1.1)
- [ ] Additional framework support (Svelte, SolidJS)
- [ ] Database schema generation
- [ ] API documentation generation (OpenAPI/Swagger)
- [ ] Custom templates and themes

### Medium Term (v1.2)
- [ ] Real-time collaboration features
- [ ] Project version management
- [ ] CI/CD pipeline generation
- [ ] Cloud deployment integration

### Long Term (v2.0)
- [ ] Visual architecture diagrams
- [ ] Code review and optimization suggestions
- [ ] Plugin system for custom generators
- [ ] Enterprise features and SSO

---

**Built with ❤️ using SPARC methodology and AI assistance**

For more information, visit our [documentation](docs/) or create an [issue](issues/new).
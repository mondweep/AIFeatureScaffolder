import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import path from 'path';
import { FeatureRequest, SparcOutput } from './types';
import { InputProcessor } from './services/input-processor';
import { SparcGenerator } from './services/sparc-generator';
import { AIService } from './services/ai-service';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
}

// Initialize services
const inputProcessor = new InputProcessor();
const aiService = new AIService();
const sparcGenerator = new SparcGenerator(aiService);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Main generation endpoint
app.post('/api/generate', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Validate request body
    const request: FeatureRequest = req.body;
    
    if (!request.description?.trim()) {
      return res.status(400).json({
        error: 'Feature description is required'
      });
    }

    // Process input and validate
    const processedInput = await inputProcessor.process(request);
    
    if (!processedInput.isValid) {
      return res.status(400).json({
        error: 'Invalid input',
        details: processedInput.errors
      });
    }

    // Generate SPARC files
    const sparcOutput = await sparcGenerator.generate(processedInput.data);
    const generationTime = Date.now() - startTime;

    const response: SparcOutput = {
      ...sparcOutput,
      generationTime,
      timestamp: new Date().toISOString()
    };

    res.json(response);

  } catch (error) {
    console.error('Generation error:', error);
    
    const generationTime = Date.now() - startTime;
    
    res.status(500).json({
      error: 'Generation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      generationTime
    });
  }
});

// Get AI providers endpoint
app.get('/api/providers', (req, res) => {
  res.json({
    providers: [
      { id: 'openai', name: 'OpenAI GPT-4', available: !!process.env.OPENAI_API_KEY },
      { id: 'anthropic', name: 'Anthropic Claude', available: !!process.env.ANTHROPIC_API_KEY },
      { id: 'google', name: 'Google Gemini', available: !!process.env.GOOGLE_API_KEY }
    ]
  });
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 AI Feature Scaffolder server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
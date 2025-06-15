#!/bin/bash

# AI Feature Scaffolder - Development Startup Script
# This script starts the development environment for the AI Feature Scaffolder

echo "🚀 Starting AI Feature Scaffolder Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your API keys before running the application"
    echo "   Required: At least one of OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run tests to make sure everything is working
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix the issues before starting the application."
    exit 1
fi

echo "✅ All tests passed!"

# Check if API keys are configured
if [ -f .env ]; then
    source .env
    if [ -z "$OPENAI_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ] && [ -z "$GOOGLE_API_KEY" ]; then
        echo "⚠️  Warning: No AI service API keys found in .env file"
        echo "   The application will use mock responses for testing"
        echo "   Please configure at least one API key for full functionality"
    fi
fi

echo ""
echo "🎉 AI Feature Scaffolder is ready!"
echo ""
echo "Development mode:"
echo "  Frontend: npm run dev    (starts Vite dev server on port 5173)"
echo "  Backend:  npm run start:dev (starts Express server on port 3000)"
echo ""
echo "Production mode:"
echo "  Build:    npm run build"
echo "  Start:    npm start"
echo ""
echo "Testing:"
echo "  Unit:     npm run test:unit"
echo "  Coverage: npm run test:coverage"
echo "  E2E:      npm run test:e2e"
echo ""
echo "📚 Documentation: Check the README.md file for more information"
echo "🔧 Configuration: Edit .env file to configure API keys and settings"
echo ""

# Ask user what they want to do
echo "What would you like to do?"
echo "1) Start development servers (frontend + backend)"
echo "2) Build for production"
echo "3) Run tests only"
echo "4) Exit"
echo ""
read -p "Choose an option (1-4): " choice

case $choice in
    1)
        echo "🚀 Starting development servers..."
        echo "Frontend will be available at: http://localhost:5173"
        echo "Backend API will be available at: http://localhost:3000"
        echo "Press Ctrl+C to stop both servers"
        
        # Start backend in background
        npm run start:dev &
        BACKEND_PID=$!
        
        # Wait a moment for backend to start
        sleep 2
        
        # Start frontend (this will run in foreground)
        npm run dev
        
        # Clean up backend when frontend stops
        kill $BACKEND_PID 2>/dev/null
        ;;
    2)
        echo "🏗️ Building for production..."
        npm run build
        echo "✅ Production build complete!"
        echo "Run 'npm start' to start the production server"
        ;;
    3)
        echo "🧪 Running all tests..."
        npm run test:coverage
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Please run the script again and choose 1-4."
        exit 1
        ;;
esac
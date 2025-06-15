import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from '@jest/globals';
import { server } from './fixtures/msw-server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.SESSION_SECRET = 'test-session-secret';

// Mock fetch for Node.js environment
global.fetch = require('node-fetch');

// Suppress console logs during testing
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
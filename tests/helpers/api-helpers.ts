import request from 'supertest';
import { Express } from 'express';

export class ApiTestHelper {
  private app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  async post(endpoint: string, data: any, expectedStatus: number = 200) {
    const response = await request(this.app)
      .post(endpoint)
      .send(data)
      .expect(expectedStatus);
    
    return response;
  }

  async get(endpoint: string, expectedStatus: number = 200) {
    const response = await request(this.app)
      .get(endpoint)
      .expect(expectedStatus);
    
    return response;
  }

  async put(endpoint: string, data: any, expectedStatus: number = 200) {
    const response = await request(this.app)
      .put(endpoint)
      .send(data)
      .expect(expectedStatus);
    
    return response;
  }

  async delete(endpoint: string, expectedStatus: number = 200) {
    const response = await request(this.app)
      .delete(endpoint)
      .expect(expectedStatus);
    
    return response;
  }

  async uploadFile(endpoint: string, fieldName: string, filePath: string, expectedStatus: number = 200) {
    const response = await request(this.app)
      .post(endpoint)
      .attach(fieldName, filePath)
      .expect(expectedStatus);
    
    return response;
  }
}

export const createTestDatabase = () => {
  // Mock database operations for testing
  const mockDb = {
    users: new Map(),
    posts: new Map(),
    templates: new Map(),
    sessions: new Map()
  };

  return {
    connect: jest.fn().mockResolvedValue(true),
    disconnect: jest.fn().mockResolvedValue(true),
    clear: jest.fn().mockImplementation(() => {
      mockDb.users.clear();
      mockDb.posts.clear();
      mockDb.templates.clear();
      mockDb.sessions.clear();
    }),
    query: jest.fn(),
    getMockData: () => mockDb
  };
};

export const mockAiService = {
  generateContent: jest.fn().mockResolvedValue('Mock AI generated content'),
  validateApiKey: jest.fn().mockResolvedValue(true),
  checkRateLimit: jest.fn().mockResolvedValue(true),
  getUsage: jest.fn().mockResolvedValue({ tokens: 100, requests: 1 })
};

export const createMockRequest = (body: any = {}, params: any = {}, query: any = {}) => ({
  body,
  params,
  query,
  headers: {},
  user: null,
  session: {}
});

export const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.download = jest.fn().mockReturnValue(res);
  res.attachment = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
};
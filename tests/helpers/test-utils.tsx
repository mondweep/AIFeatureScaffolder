import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Custom render function with providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Helper functions for testing
export const createMockFile = (name: string, content: string, type: string = 'text/plain'): File => {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
};

export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

export const mockLocalStorage = () => {
  const store: { [key: string]: string } = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    })
  };
};

export const mockFetch = (response: any, ok: boolean = true, status: number = 200) => {
  return jest.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
    headers: new Headers(),
    statusText: ok ? 'OK' : 'Error'
  });
};

export const createMockFormData = (data: Record<string, string>): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};
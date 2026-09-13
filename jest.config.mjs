import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

export default createJestConfig({
  coverageProvider: 'v8',
  coverageThreshold: {
    global: { statements: 90, branches: 85 },
    './utils/filterCatalog.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
  },
  coveragePathIgnorePatterns: ['/node_modules/', '/app/blog/\\(content\\)/', '/components/ui/', '/lib/catalog.ts', '/lib/blog.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/tests/e2e/'],
});

import type { Config } from 'jest';

const config: Config = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',       
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }], 
  },
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  clearMocks: true,
  collectCoverage: true,
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/jest.cssMock.ts',
    "^host/(.*)$": "<rootDir>/__mocks__/$1.tsx"
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageDirectory: 'coverage'
};

export default config;

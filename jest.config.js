module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ["src/liquidjs/"],
  setupFiles: [
    "./spec/__mocks__/client.ts"
  ],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
};

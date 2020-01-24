module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ["src/liquidjs/"],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
};

const babelJestPath = require.resolve('babel-jest');

module.exports = {
  // Jest 26 defaults, kept so tests relying on browser globals and existing snapshots still hold.
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup.js'],
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': babelJestPath,
  },
  transformIgnorePatterns: ['^.+\\.module\\.(css|sass|scss)$'],
};

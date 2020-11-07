const babelJestPath = require.resolve('babel-jest');

module.exports = {
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': babelJestPath,
  },
  transformIgnorePatterns: ['^.+\\.module\\.(css|sass|scss)$'],
};

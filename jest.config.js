const babelJestPath = require.resolve('babel-jest');
const vueJestPath = require.resolve('vue-jest');

module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': babelJestPath,
    '^.+\\.(vue)$': vueJestPath,
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['^.+\\.module\\.(css|sass|scss)$'],
};

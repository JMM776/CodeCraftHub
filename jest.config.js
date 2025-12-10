module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testTimeout: 30000,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/app.js',
    '!src/config/**',
    '!src/utils/logger.js'
  ],
};

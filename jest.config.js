module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
  // testMatch: ['**/test/**/*.test.(ts|js)', '**/spec/**/*.spec.(ts|js)'],
  testEnvironment: 'node',
  modulePaths: ['<rootDir>'],
};

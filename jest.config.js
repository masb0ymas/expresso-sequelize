module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  modulePaths: ['src'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^@apps(.*)$': '<rootDir>/src/apps$1',
    '^@core(.*)$': '<rootDir>/src/core$1',
    '^@config(.*)$': '<rootDir>/src/config$1',
    '^@database(.*)$': '<rootDir>/src/database$1',
    '^@routes(.*)$': '<rootDir>/src/routes$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testTimeout: 30000,
}

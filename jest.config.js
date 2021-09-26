module.exports = {
  verbose: true,
  collectCoverage: true,
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "\\.ts$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
  collectCoverageFrom: [
    "./**/*.ts"
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
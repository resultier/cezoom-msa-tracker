module.exports = {
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  testRunner: "jest-jasmine2",
  testTimeout: 50000,
};

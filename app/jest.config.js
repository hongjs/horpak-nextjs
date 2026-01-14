const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleDirectories: ["node_modules", "<rootDir>"],
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/test-utils.tsx"],
  moduleNameMapper: {
    "^lib/(.*)$": "<rootDir>/lib/$1",
    "^components/(.*)$": "<rootDir>/components/$1",
    "^config/(.*)$": "<rootDir>/config/$1",
    "^middleware/(.*)$": "<rootDir>/middleware/$1",
    "^types/(.*)$": "<rootDir>/types/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);

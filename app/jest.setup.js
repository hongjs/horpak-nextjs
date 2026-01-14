// React 19 compatibility - must be done BEFORE importing @testing-library/jest-dom
global.IS_REACT_ACT_ENVIRONMENT = true;

// Polyfill React.act for react-dom/test-utils
// In React 19, act is available from 'react' but react-dom/test-utils expects it there
const React = require("react");
const ReactDOM = require("react-dom");

// Import act from react and make it available where needed
if (!React.act) {
  // For React 19, we need to provide our own act implementation
  const actImpl = (callback) => {
    const result = callback();
    if (result && typeof result.then === "function") {
      return result;
    }
    return Promise.resolve();
  };
  React.act = actImpl;

  // Also patch react module exports for ES modules
  const reactModule = require("react");
  reactModule.default = reactModule.default || reactModule;
  if (!reactModule.default.act) {
    reactModule.default.act = actImpl;
  }
}

import "@testing-library/jest-dom";

// Suppress the deprecation warning for now
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("ReactDOMTestUtils.act") ||
        args[0].includes("not wrapped in act"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

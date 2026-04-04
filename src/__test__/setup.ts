import "@testing-library/jest-dom";

// Mock environment variables used across the codebase
process.env.COOKIE_NAME = "test-cookie";
process.env.SECRET = "test-secret-key-for-jwt";
process.env.GEMINI_API_KEY = "test-gemini-key";

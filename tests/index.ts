/**
 * Test Suite Index
 *
 * This file exports all test utilities, configurations, and common test patterns
 * for the Century 360° project.
 */

// Test utilities
export * from "./utils/test-utils";

// Test configurations
export { default as testConfig } from "./config/test-config";

// Common test patterns
export * from "./patterns/component-testing";
export * from "./patterns/integration-testing";
export * from "./patterns/e2e-testing";

// Test data factories
export * from "./factories/user-factory";
export * from "./factories/product-factory";
export * from "./factories/order-factory";

// Mock data
export * from "./mocks/api-mocks";
export * from "./mocks/database-mocks";
export * from "./mocks/navigation-mocks";

// Test constants
export * from "./constants/test-constants";

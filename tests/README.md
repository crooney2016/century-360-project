# Testing Infrastructure

This directory contains the comprehensive testing infrastructure for the Century
360° project.

## 🏗️ Test Structure

```
tests/
├── unit/                 # Unit tests for individual components
│   ├── components/       # Component unit tests
│   ├── hooks/           # Custom hook tests
│   ├── utils/           # Utility function tests
│   └── stores/          # State management tests
├── integration/          # Integration tests for component interactions
│   ├── layout/          # Layout component tests
│   ├── forms/           # Form component tests
│   └── navigation/      # Navigation flow tests
├── e2e/                 # End-to-end tests using Playwright
│   ├── homepage.spec.ts # Homepage user journey tests
│   ├── admin.spec.ts    # Admin panel tests
│   └── auth.spec.ts     # Authentication flow tests
├── utils/                # Test utilities and helpers
├── mocks/                # Mock data and API responses
├── factories/            # Test data factories
├── patterns/             # Common testing patterns
└── config/               # Test configuration files
```

## 🚀 Running Tests

### Unit Tests

```bash
# Run all unit tests
pnpm test:unit

# Run specific unit test file
pnpm test tests/unit/components/Button.test.tsx

# Run unit tests with coverage
pnpm test:unit --coverage
```

### Integration Tests

```bash
# Run all integration tests
pnpm test:integration

# Run specific integration test
pnpm test tests/integration/layout/GlobalLayout.test.tsx
```

### E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run E2E tests in headed mode
pnpm test:e2e:headed
```

### Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# View coverage in browser
open coverage/index.html
```

## 📝 Writing Tests

### Component Testing Pattern

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
import { TestWrapper } from "@/tests/utils/test-utils";

describe("Button Component", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>, { wrapper: TestWrapper });
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>, { wrapper: TestWrapper });

    fireEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Testing Pattern

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlobalLayout } from "@/components/layout/GlobalLayout";
import { TestWrapper } from "@/tests/utils/test-utils";

describe("GlobalLayout Integration", () => {
  it("renders complete layout structure", () => {
    render(
      <GlobalLayout>
        <div data-testid="main-content">Main Content</div>
      </GlobalLayout>,
      { wrapper: TestWrapper }
    );

    expect(screen.getByTestId("main-content")).toBeInTheDocument();
  });
});
```

### E2E Testing Pattern

```typescript
import { test, expect } from "@playwright/test";

test.describe("Homepage E2E Tests", () => {
  test("should load homepage successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Century 360/);
    await expect(page.locator("text=Dashboard")).toBeVisible();
  });
});
```

## 🎯 Testing Best Practices

### 1. Test Organization

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions and data flow
- **E2E Tests**: Test complete user journeys

### 2. Test Naming

- Use descriptive test names that explain the expected behavior
- Follow the pattern: "should [expected behavior] when [condition]"

### 3. Test Structure

- **Arrange**: Set up test data and conditions
- **Act**: Execute the function or interaction being tested
- **Assert**: Verify the expected outcome

### 4. Coverage Goals

- **Lines**: 80% minimum
- **Functions**: 80% minimum
- **Branches**: 80% minimum
- **Statements**: 80% minimum

### 5. Mocking Strategy

- Mock external dependencies (APIs, databases)
- Use factories for test data
- Keep mocks close to the tests that use them

## 🔧 Test Configuration

### Vitest Configuration

- **Environment**: jsdom for React component testing
- **Coverage**: v8 provider with HTML and LCOV reports
- **Thresholds**: 80% minimum coverage for all metrics

### Playwright Configuration

- **Browsers**: Chromium, Firefox, WebKit
- **Viewports**: Mobile, tablet, and desktop sizes
- **Retries**: 2 retries for flaky tests

## 📊 Coverage Reports

Coverage reports are generated in multiple formats:

- **HTML**: Interactive browser-based report
- **LCOV**: CI/CD integration format
- **JSON**: Programmatic access to coverage data
- **Text**: Console output for quick review

## 🚨 Pre-Development Validation

Before starting the dev server, run the validation script:

```bash
pnpm validate:full
```

This script runs:

1. Theme configuration tests
2. Hydration validation tests
3. Component rendering tests
4. Build validation
5. Type checking
6. Linting

## 🔍 Debugging Tests

### Unit Tests

```bash
# Run tests in watch mode
pnpm test:watch

# Run specific test with debug output
pnpm test Button.test.tsx --reporter=verbose
```

### E2E Tests

```bash
# Run tests with UI
pnpm test:e2e:ui

# Run tests in headed mode
pnpm test:e2e:headed

# Debug specific test
pnpm test:e2e --grep "should load homepage"
```

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

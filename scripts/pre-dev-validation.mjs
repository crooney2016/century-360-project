#!/usr/bin/env node

/**
 * Pre-Development Server Validation Script
 *
 * This script runs critical tests before starting the dev server to catch:
 * - Hydration issues
 * - Theme configuration problems
 * - Component rendering errors
 * - Database integration issues
 *
 * Run this before starting the dev server to ensure everything is working.
 */

import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

console.log("🚀 Pre-Development Server Validation");
console.log("=====================================");

const runCommand = (command, description) => {
  try {
    console.log(`\n📋 ${description}...`);
    execSync(command, {
      cwd: projectRoot,
      stdio: "inherit",
      env: { ...process.env, CI: "true" },
    });
    console.log(`✅ ${description} - PASSED`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} - FAILED`);
    console.error(`Command: ${command}`);
    console.error(`Error: ${error.message}`);
    return false;
  }
};

const runTest = (testPath, description) => {
  return runCommand(`pnpm test ${testPath} --run`, description);
};

const main = async () => {
  const startTime = Date.now();
  let allPassed = true;

  console.log("\n🔍 Running Critical Validation Tests...");

  // 1. Theme Configuration Tests
  allPassed =
    runTest("src/tests/hydration-theme.test.tsx", "Theme Configuration & Hydration Validation") &&
    allPassed;

  // 2. Homepage Component Tests
  allPassed =
    runTest("src/app/__tests__/page.test.tsx", "Homepage Component Rendering") && allPassed;

  // 3. Build Validation (without starting server)
  allPassed = runCommand("pnpm build", "Production Build Validation") && allPassed;

  // 4. Type Checking
  allPassed = runCommand("pnpm type-check", "TypeScript Type Checking") && allPassed;

  // 5. Linting
  allPassed = runCommand("pnpm lint", "Code Quality & Style Validation") && allPassed;

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log("\n" + "=".repeat(50));

  if (allPassed) {
    console.log("🎉 ALL VALIDATIONS PASSED!");
    console.log(`⏱️  Total time: ${duration}s`);
    console.log("\n✅ You can now safely start the development server with:");
    console.log("   pnpm dev");
    console.log("\n🚀 Happy coding!");
    process.exit(0);
  } else {
    console.log("❌ VALIDATION FAILED!");
    console.log(`⏱️  Total time: ${duration}s`);
    console.log("\n🔧 Please fix the issues above before starting the dev server.");
    console.log("💡 Common fixes:");
    console.log("   - Check theme configuration in src/lib/theme/index.ts");
    console.log("   - Verify ChakraProvider setup in src/components/ChakraProvider.tsx");
    console.log("   - Ensure all components use consistent props (spacing vs gap)");
    console.log("   - Check for hydration mismatches in component rendering");
    console.log("\n🔄 Re-run validation after fixes:");
    console.log("   node scripts/pre-dev-validation.mjs");
    process.exit(1);
  }
};

// Handle uncaught errors
process.on("uncaughtException", error => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

main().catch(error => {
  console.error("❌ Validation script failed:", error);
  process.exit(1);
});

/**
 * Ruleset Compliance Tests
 *
 * These tests verify that:
 * 1. All cursor rules have proper frontmatter
 * 2. Linting rules are not overly suppressed
 * 3. The hierarchical organization is maintained
 * 4. Rule interactions work as expected
 */

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { glob } from "glob";
import path from "path";

const RULES_DIR = path.join(process.cwd(), ".cursor/rules");

describe("Ruleset Compliance", () => {
  describe("Frontmatter Validation", () => {
    it("should have proper frontmatter in all .mdc files", async () => {
      // Check if rules directory exists before proceeding
      if (!existsSync(RULES_DIR)) {
        console.warn("Rules directory not found, skipping frontmatter validation");
        return;
      }

      const mdcFiles = glob.sync("**/*.mdc", { cwd: RULES_DIR });

      for (const file of mdcFiles) {
        const content = readFileSync(path.join(RULES_DIR, file), "utf8");

        // Check for frontmatter
        expect(content).toMatch(/^---\s*\n/);
        expect(content).toMatch(/\n---\s*\n/);

        // Check for proper declaration
        const hasAlwaysApply = content.includes("alwaysApply: true");
        const hasIntelligentlyApply = content.includes("intelligentlyApply: true");

        expect(hasAlwaysApply || hasIntelligentlyApply).toBe(true);

        console.log(`✅ ${file}: ${hasAlwaysApply ? "alwaysApply" : "intelligentlyApply"}`);
      }
    });

    it("should have core.mdc and index.mdc as alwaysApply", () => {
      const coreContent = readFileSync(path.join(RULES_DIR, "core.mdc"), "utf8");
      const indexContent = readFileSync(path.join(RULES_DIR, "index.mdc"), "utf8");

      expect(coreContent).toMatch(/alwaysApply:\s*true/);
      expect(indexContent).toMatch(/alwaysApply:\s*true/);
    });

    it("should have other rules as intelligentlyApply", () => {
      const otherRules = [
        "decision.mdc",
        "build.mdc",
        "ui.mdc",
        "architecture.mdc",
        "docs.mdc",
        "packages.mdc",
        "testing.mdc",
      ];

      for (const rule of otherRules) {
        const content = readFileSync(path.join(RULES_DIR, rule), "utf8");
        expect(content).toMatch(/intelligentlyApply:\s*true/);
      }
    });
  });

  describe("Linting Rule Validation", () => {
    it("should not have overly suppressed markdown linting rules", () => {
      const markdownlintConfig = JSON.parse(readFileSync(".markdownlint.json", "utf8"));

      // Check that critical rules are enabled
      const criticalRules = [
        "MD001", // Heading levels should only increment by one level at a time
        "MD002", // First heading should be a top-level heading
        "MD010", // Hard tabs - use spaces instead
        "MD011", // Reversed link syntax
        "MD014", // Dollar signs used before commands without showing output
        "MD018", // No space after hash on atx style heading
        "MD019", // Multiple spaces after hash on atx style heading
        "MD020", // No space inside hashes on closed atx style heading
        "MD021", // Multiple spaces inside hashes on closed atx style heading
        "MD023", // Headings must start at the beginning of the line
        "MD027", // Multiple spaces after blockquote symbol
        "MD028", // Blockquote without attribution
        "MD034", // Bare URL used
        "MD036", // No emphasis for headings
        "MD037", // Spaces inside emphasis markers
        "MD038", // Spaces inside code span elements
        "MD039", // Spaces inside link text
        "MD042", // No empty links
        "MD045", // Images should have alternate text (alt text)
        "MD047", // Files should end with a single newline character
      ];

      for (const rule of criticalRules) {
        expect(markdownlintConfig[rule]).toBe(true);
      }

      // Check that only style preferences are disabled
      const disabledRules = [
        "MD003", // Heading style - we don't care about # vs ##
        "MD004", // Unordered list style - we don't care about * vs -
        "MD005", // Inconsistent list item indentation
        "MD006", // Consider starting bulleted lists at the beginning of the line
        "MD007", // Unordered list indentation
        "MD008", // Unordered list item indentation
        "MD009", // Trailing spaces in code blocks
        "MD012", // Multiple consecutive blank lines
        "MD013", // Line length limits - we don't care about character counts
        "MD022", // Headings should be surrounded by blank lines
        "MD024", // Duplicate headings
        "MD025", // Multiple top-level headings
        "MD026", // Trailing punctuation in headings
        "MD029", // Ordered list item prefix style
        "MD030", // List item marker spacing
        "MD031", // Blank lines around fenced code blocks
        "MD032", // Lists should be surrounded by blank lines
        "MD033", // Allow inline HTML when needed
        "MD035", // Horizontal rule style
        "MD040", // Fenced code blocks should have a language specified
        "MD041", // First line heading requirement
        "MD043", // Required heading structure
        "MD044", // Proper names should have the correct capitalization
        "MD046", // Code block style
        "MD048", // Code fence style
      ];

      for (const rule of disabledRules) {
        expect(markdownlintConfig[rule]).toBe(false);
      }
    });

    it("should have strict ESLint rules enabled", () => {
      const eslintConfigContent = readFileSync("eslint.config.mjs", "utf8");

      // Check that critical TypeScript rules are enabled
      const criticalRules = [
        "@typescript-eslint/no-explicit-any",
        "@typescript-eslint/no-unused-vars",
        "@typescript-eslint/no-unused-expressions",
        "@typescript-eslint/no-this-alias",
        "@typescript-eslint/no-require-imports",
        "@typescript-eslint/no-empty-object-type",
      ];

      for (const rule of criticalRules) {
        expect(eslintConfigContent).toContain(`"${rule}": "error"`);
      }
    });
  });

  describe("Hierarchical Organization", () => {
    it("should have proper layer structure in index.mdc", () => {
      const indexContent = readFileSync(path.join(RULES_DIR, "index.mdc"), "utf8");

      // Check for layer definitions
      expect(indexContent).toMatch(/Layer 1: Momentum Engineering/);
      expect(indexContent).toMatch(/Layer 2: Acceleration Engineering/);

      // Check for domain organization
      expect(indexContent).toMatch(/Decision Domain/);
      expect(indexContent).toMatch(/Development Domain/);
      expect(indexContent).toMatch(/Implementation Domain/);
    });

    it("should have visual graph representation", () => {
      const indexContent = readFileSync(path.join(RULES_DIR, "index.mdc"), "utf8");

      // Check for ASCII art diagrams
      expect(indexContent).toMatch(
        /┌─────────────────────────────────────────────────────────────────┐/
      );
      expect(indexContent).toMatch(/MOMENTUM ENGINEERING LAYER/);
      expect(indexContent).toMatch(/ACCELERATION ENGINEERING LAYER/);
    });

    it("should have interaction patterns defined", () => {
      const indexContent = readFileSync(path.join(RULES_DIR, "index.mdc"), "utf8");

      expect(indexContent).toMatch(/Cross-Domain Interactions/);
      expect(indexContent).toMatch(/Feedback Loops/);
      expect(indexContent).toMatch(/Loading Strategy/);
    });
  });

  describe("Momentum Principles", () => {
    it("should have momentum-building principles in core.mdc", () => {
      const coreContent = readFileSync(path.join(RULES_DIR, "core.mdc"), "utf8");

      expect(coreContent).toMatch(/Momentum Principles/);
      expect(coreContent).toMatch(/Build on success/);
      expect(coreContent).toMatch(/Accelerate through context/);
      expect(coreContent).toMatch(/Minimize friction/);
      expect(coreContent).toMatch(/Maximize velocity/);
      expect(coreContent).toMatch(/Create compounding effects/);
    });

    it("should have velocity-focused decision framework", () => {
      const decisionContent = readFileSync(path.join(RULES_DIR, "decision.mdc"), "utf8");

      expect(decisionContent).toMatch(/Velocity-Focused Decision Framework/);
      expect(decisionContent).toMatch(/Quick Decision Protocol/);
      expect(decisionContent).toMatch(/Pattern Recognition/);
      expect(decisionContent).toMatch(/Velocity Assessment/);
      expect(decisionContent).toMatch(/Risk Mitigation/);
    });
  });

  describe("Documentation Quality", () => {
    it("should have comprehensive documentation standards", () => {
      const docsContent = readFileSync(path.join(RULES_DIR, "docs.mdc"), "utf8");

      expect(docsContent).toMatch(/Documentation Standards/);
      expect(docsContent).toMatch(/Markdown Standards/);
      expect(docsContent).toMatch(/TSDoc Standards/);
      expect(docsContent).toMatch(/TypeDoc Integration/);
    });

    it("should have testing patterns defined", () => {
      const testingContent = readFileSync(path.join(RULES_DIR, "testing.mdc"), "utf8");

      expect(testingContent).toMatch(/Testing Strategy/);
      expect(testingContent).toMatch(/Vitest/);
      expect(testingContent).toMatch(/Playwright/);
      expect(testingContent).toMatch(/Storybook/);
    });
  });

  describe("Custom Linting Rules", () => {
    it("should have Century 360 custom rules", () => {
      const customRulesContent = readFileSync("scripts/markdown-custom-rules.mjs", "utf8");

      expect(customRulesContent).toMatch(/Century 360 Custom Markdown Lint Rules/);
      expect(customRulesContent).toMatch(/century360-docs/);
      expect(customRulesContent).toMatch(/adaptive-suggestions/);
    });

    it("should have analytics tracking", () => {
      const customRulesContent = readFileSync("scripts/markdown-custom-rules.mjs", "utf8");

      expect(customRulesContent).toMatch(/trackIssue/);
      expect(customRulesContent).toMatch(/analyzePatterns/);
      expect(customRulesContent).toMatch(/generateLintReport/);
    });
  });
});

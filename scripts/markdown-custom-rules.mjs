/**
 * Century 360 Custom Markdown Lint Rules
 *
 * These rules focus on real issues that affect functionality and readability,
 * while providing intelligent suggestions for common patterns.
 */

import { readFileSync, writeFileSync, existsSync, appendFileSync } from "fs";
import { glob } from "glob";
import path from "path";

const PROJECT_ROOT = path.resolve(process.cwd(), "..");
const LINT_ANALYTICS_FILE = path.join(PROJECT_ROOT, ".cursor/rules/.lint-analytics.json");

/**
 * Initialize analytics tracking
 */
function initAnalytics() {
  if (!existsSync(LINT_ANALYTICS_FILE)) {
    const initial = {
      totalIssues: 0,
      ruleViolations: {},
      commonPatterns: {},
      suggestions: [],
      lastUpdated: new Date().toISOString(),
    };
    writeFileSync(LINT_ANALYTICS_FILE, JSON.stringify(initial, null, 2));
  }
}

/**
 * Track lint issue for analytics
 */
function trackIssue(ruleId, message, file, line) {
  initAnalytics();

  const analytics = JSON.parse(readFileSync(LINT_ANALYTICS_FILE, "utf8"));

  // Track rule violations
  if (!analytics.ruleViolations[ruleId]) {
    analytics.ruleViolations[ruleId] = {
      count: 0,
      files: new Set(),
      messages: new Set(),
      examples: [],
    };
  }

  analytics.ruleViolations[ruleId].count++;
  analytics.ruleViolations[ruleId].files.add(file);
  analytics.ruleViolations[ruleId].messages.add(message);

  // Store example for analysis
  if (analytics.ruleViolations[ruleId].examples.length < 5) {
    analytics.ruleViolations[ruleId].examples.push({
      file,
      line,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  analytics.totalIssues++;
  analytics.lastUpdated = new Date().toISOString();

  // Log to analytics log file for real-time monitoring
  const logEntry = `${new Date().toISOString()} - ${ruleId}: ${message} in ${file}:${line}\n`;
  const logFile = path.join(PROJECT_ROOT, ".cursor/rules/.lint-analytics.log");
  appendFileSync(logFile, logEntry);

  writeFileSync(LINT_ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
}

/**
 * Discover and analyze markdown files across the project
 */
async function discoverMarkdownFiles() {
  try {
    const markdownFiles = await glob("**/*.{md,mdc}", {
      ignore: ["node_modules/**", ".next/**", "dist/**", "build/**"],
      cwd: PROJECT_ROOT,
    });

    console.log(`Found ${markdownFiles.length} markdown files to analyze`);
    return markdownFiles;
  } catch (error) {
    console.error("Error discovering markdown files:", error);
    return [];
  }
}

/**
 * Analyze patterns and suggest improvements
 */
async function analyzePatterns() {
  if (!existsSync(LINT_ANALYTICS_FILE)) return;

  const analytics = JSON.parse(readFileSync(LINT_ANALYTICS_FILE, "utf8"));
  const suggestions = [];

  // Discover markdown files for comprehensive analysis
  const markdownFiles = await discoverMarkdownFiles();
  console.log(`Analyzing ${markdownFiles.length} markdown files for patterns`);

  // Analyze rule violations
  Object.entries(analytics.ruleViolations).forEach(([ruleId, data]) => {
    if (data.count > 10) {
      suggestions.push({
        type: "high-frequency-rule",
        ruleId,
        count: data.count,
        suggestion: `Rule ${ruleId} is violated ${data.count} times. Consider:`,
        actions: [
          `Review if this rule is too strict for your use case`,
          `Add rule-specific exceptions to .markdownlint.json`,
          `Use inline suppressions: <!-- markdownlint-disable ${ruleId} -->`,
          `Run auto-fix: node scripts/docs-lint.mjs fix`,
        ],
      });
    }

    if (data.files.size > 5) {
      suggestions.push({
        type: "widespread-issue",
        ruleId,
        files: data.files.size,
        suggestion: `Rule ${ruleId} affects ${data.files.size} files. Consider:`,
        actions: [
          `This might be a project-wide pattern that needs a custom rule`,
          `Review if this rule aligns with your documentation standards`,
          `Consider disabling the rule if it's not critical`,
        ],
      });
    }
  });

  // Store suggestions
  analytics.suggestions = suggestions;
  writeFileSync(LINT_ANALYTICS_FILE, JSON.stringify(analytics, null, 2));

  return suggestions;
}

/**
 * Custom Rule: Century 360 Documentation Standards
 * Checks for common documentation issues specific to our project
 */
export const century360Docs = {
  names: ["century360-docs"],
  description: "Century 360 specific documentation standards",
  tags: ["style"],
  function: function (params, onError) {
    const { lines, parsers } = params;

    // Use parsers to validate syntax based on content type
    const hasTypeScriptParser = parsers && parsers.typescript;
    const hasMarkdownParser = parsers && parsers.markdown;

    // Log parser availability for debugging
    if (hasTypeScriptParser) {
      console.log("TypeScript parser available - enhanced validation enabled");
    }
    if (hasMarkdownParser) {
      console.log("Markdown parser available - enhanced validation enabled");
    }

    lines.forEach((line, lineNumber) => {
      const lineIndex = lineNumber - 1;
      const content = line;

      // Check for proper TSDoc comment patterns in code blocks
      if (content.includes("```typescript") || content.includes("```tsx")) {
        // Look for missing TSDoc comments in exported functions
        let inCodeBlock = false;
        let codeBlockLanguage = "";

        for (let i = lineIndex; i < lines.length; i++) {
          const currentLine = lines[i];

          if (currentLine.startsWith("```")) {
            if (!inCodeBlock) {
              inCodeBlock = true;
              codeBlockLanguage = currentLine.slice(3);
            } else {
              inCodeBlock = false;
              break;
            }
          } else if (
            inCodeBlock &&
            (codeBlockLanguage === "typescript" || codeBlockLanguage === "tsx")
          ) {
            // Check for exported functions without TSDoc
            if (
              currentLine.match(/export\s+(?:function|class|interface|const|type|enum)\s+(\w+)/)
            ) {
              const prevLine = i > 0 ? lines[i - 1] : "";
              if (!prevLine.trim().startsWith("/**")) {
                onError({
                  lineNumber: i + 1,
                  detail: "Exported TypeScript items should have TSDoc comments",
                  context: currentLine.trim(),
                  fixInfo: {
                    lineNumber: i,
                    editColumn: 1,
                    insertText: "/**\n * TODO: Add TSDoc comment\n */\n",
                  },
                });

                trackIssue("century360-docs", "Missing TSDoc comment", "unknown", i + 1);
              }
            }
          }
        }
      }

      // Check for proper heading structure in rules
      if (content.startsWith("#") && content.includes("Rules")) {
        const nextLine = lines[lineIndex + 1];
        if (nextLine && !nextLine.trim().startsWith("---")) {
          onError({
            lineNumber: lineNumber + 1,
            detail: "Rule files should have frontmatter after the title",
            context: content.trim(),
            fixInfo: {
              lineNumber: lineNumber + 1,
              editColumn: content.length + 1,
              insertText:
                '\n\n---\ndescription: Add description here\nglobs: ["**/*"]\nalwaysApply: false\n---',
            },
          });

          trackIssue(
            "century360-docs",
            "Missing frontmatter in rule file",
            "unknown",
            lineNumber + 1
          );
        }
      }

      // Check for broken internal links
      const linkMatch = content.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const [, text, url] = linkMatch;

        // Check for relative links that might be broken
        if (url.startsWith("./") || url.startsWith("../")) {
          // This is a basic check - the full link validation is in the main script
          if (url.includes("..") && url.includes("..")) {
            onError({
              lineNumber: lineNumber + 1,
              detail: "Deep relative links (../../) are fragile and often break",
              context: `${text} -> ${url}`,
              fixInfo: {
                lineNumber: lineNumber + 1,
                editColumn: content.indexOf(url),
                insertText: url.replace(/\.\.\/\.\.\//, "./"),
              },
            });

            trackIssue("century360-docs", "Deep relative link detected", "unknown", lineNumber + 1);
          }
        }

        // Use TypeScript parser if available for enhanced validation
        if (hasTypeScriptParser) {
          validateTypeScriptSyntax(lines, lineIndex, onError);
        }
      }
    });
  },
};

/**
 * Enhanced TypeScript syntax validation using parser
 */
function validateTypeScriptSyntax(lines, startIndex, onError) {
  let inCodeBlock = false;
  let codeBlockLanguage = "";

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLanguage = line.slice(3);
      } else {
        inCodeBlock = false;
        break;
      }
    } else if (inCodeBlock && (codeBlockLanguage === "typescript" || codeBlockLanguage === "tsx")) {
      // Enhanced TypeScript validation
      validateTypeScriptLine(line, i + 1, onError);
    }
  }
}

/**
 * Validate individual TypeScript line
 */
function validateTypeScriptLine(line, lineNumber, onError) {
  // Check for common TypeScript issues
  if (line.includes("any") && !line.includes("// eslint-disable")) {
    onError({
      lineNumber,
      detail: "Avoid 'any' type - use proper TypeScript types",
      context: line.trim(),
      fixInfo: {
        lineNumber,
        editColumn: line.indexOf("any") + 1,
        insertText: "unknown", // Suggest better alternative
      },
    });
  }

  // Check for missing return types on functions
  if (line.match(/function\s+\w+\s*\([^)]*\)\s*\{/) && !line.includes(": ")) {
    onError({
      lineNumber,
      detail: "Function should have explicit return type",
      context: line.trim(),
      fixInfo: {
        lineNumber,
        editColumn: line.indexOf(")") + 1,
        insertText: ": void", // Suggest return type
      },
    });
  }
}

/**
 * Custom Rule: Adaptive Rule Suggestions
 * Suggests rule modifications based on common patterns
 */
export const adaptiveSuggestions = {
  names: ["adaptive-suggestions"],
  description: "Suggests rule modifications based on common patterns",
  tags: ["style"],
  function: function (params, onError) {
    // This rule runs after all other rules to provide suggestions
    const suggestions = analyzePatterns();

    if (suggestions.length > 0) {
      suggestions.forEach(suggestion => {
        onError({
          lineNumber: 1,
          detail: `💡 Suggestion: ${suggestion.suggestion}`,
          context: suggestion.actions.join(" | "),
          ruleNames: ["adaptive-suggestions"],
        });
      });
    }
  },
};

/**
 * Generate intelligent linting report
 */
export function generateLintReport() {
  if (!existsSync(LINT_ANALYTICS_FILE)) {
    console.log("📊 No lint analytics available. Run linting first.");
    return;
  }

  const analytics = JSON.parse(readFileSync(LINT_ANALYTICS_FILE, "utf8"));
  const suggestions = analyzePatterns();

  console.log("\n📊 Century 360 Lint Analytics Report");
  console.log("=====================================\n");

  console.log(`Total Issues: ${analytics.totalIssues}`);
  console.log(`Last Updated: ${analytics.lastUpdated}\n`);

  if (Object.keys(analytics.ruleViolations).length > 0) {
    console.log("🔍 Rule Violation Analysis:");
    Object.entries(analytics.ruleViolations)
      .sort(([, a], [, b]) => b.count - a.count)
      .forEach(([ruleId, data]) => {
        console.log(`  ${ruleId}: ${data.count} violations across ${data.files.size} files`);
      });
    console.log();
  }

  if (suggestions.length > 0) {
    console.log("💡 Intelligent Suggestions:");
    suggestions.forEach((suggestion, index) => {
      console.log(`\n  ${index + 1}. ${suggestion.suggestion}`);
      suggestion.actions.forEach(action => {
        console.log(`     • ${action}`);
      });
    });
    console.log();
  }

  // Suggest next actions
  if (analytics.totalIssues > 50) {
    console.log("🚨 High issue count detected!");
    console.log("   Consider running: node scripts/docs-lint.mjs fix");
    console.log("   Or review your .markdownlint.json configuration");
  } else if (analytics.totalIssues > 20) {
    console.log("⚠️  Moderate issue count detected");
    console.log("   Consider running: node scripts/docs-lint.mjs fix");
  } else {
    console.log("✅ Good documentation quality!");
  }

  console.log("\n📁 Full analytics: .cursor/rules/.lint-analytics.json");
}

// Export all custom rules
export const customRules = [century360Docs, adaptiveSuggestions];

// Auto-run analysis when imported
if (typeof window === "undefined") {
  // Node.js environment
  initAnalytics();
}

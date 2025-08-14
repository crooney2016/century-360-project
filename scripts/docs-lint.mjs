#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { glob } from "glob";

const PROJECT_ROOT = process.cwd();

/**
 * Run markdownlint with custom configuration
 */
function runMarkdownLint(files, fix = false) {
  try {
    const command = fix
      ? `npx markdownlint ${files.join(" ")} --fix`
      : `npx markdownlint ${files.join(" ")}`;

    console.log(`Running: ${command}`);
    const result = execSync(command, {
      encoding: "utf8",
      stdio: "pipe",
    });

    if (result) {
      console.log(result);
    }

    return true;
  } catch (error) {
    if (error.stdout) {
      console.log(error.stdout);
    }
    if (error.stderr) {
      console.log(error.stderr);
    }
    return false;
  }
}

/**
 * Get all markdown files in the project
 */
function getMarkdownFiles() {
  const patterns = [".cursor/rules/**/*.{md,mdc}", "docs/**/*.{md,mdc}", "README.md"];

  const files = [];

  for (const pattern of patterns) {
    try {
      const matches = glob.sync(pattern, {
        cwd: PROJECT_ROOT,
        ignore: ["node_modules/**", ".next/**", "public/typedoc/**"],
      });
      files.push(...matches);
    } catch (error) {
      console.warn(`Warning: Could not process pattern ${pattern}:`, error.message);
    }
  }

  return [...new Set(files)]; // Remove duplicates
}

/**
 * Fix common markdown issues
 */
function fixMarkdownIssues(files) {
  console.log("🔧 Fixing markdown issues...");

  let fixedCount = 0;

  for (const file of files) {
    const filePath = path.join(PROJECT_ROOT, file);

    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: File not found: ${file}`);
      continue;
    }

    try {
      let content = fs.readFileSync(filePath, "utf8");
      let hasChanges = false;

      // Fix heading structure issues (MD001)
      const lines = content.split("\n");
      const fixedLines = fixHeadingStructure(lines);

      if (fixedLines.join("\n") !== content) {
        content = fixedLines.join("\n");
        hasChanges = true;
      }

      // Fix trailing whitespace (MD009)
      const trimmedContent = content.replace(/[ \t]+$/gm, "");
      if (trimmedContent !== content) {
        content = trimmedContent;
        hasChanges = true;
      }

      // Fix list indentation (MD007)
      const indentedContent = fixListIndentation(content);
      if (indentedContent !== content) {
        content = indentedContent;
        hasChanges = true;
      }

      if (hasChanges) {
        fs.writeFileSync(filePath, content);
        console.log(`  ✅ Fixed: ${file}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  return fixedCount;
}

/**
 * Fix heading structure (MD001)
 */
function fixHeadingStructure(lines) {
  const newLines = [];
  let previousLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^(#{1,6})\s+/);

    if (headingMatch) {
      const currentLevel = headingMatch[1].length;

      // Check if heading level jumps more than one
      if (currentLevel > previousLevel + 1 && previousLevel > 0) {
        console.log(
          `    Fixed heading structure at line ${i + 1}: ${currentLevel} -> ${previousLevel + 1}`
        );
        // Fix by reducing the heading level
        const fixedLine = line.replace(/^#{1,6}/, "#".repeat(previousLevel + 1));
        newLines.push(fixedLine);
      } else {
        newLines.push(line);
      }

      previousLevel = currentLevel;
    } else {
      newLines.push(line);
    }
  }

  return newLines;
}

/**
 * Fix list indentation (MD007)
 */
function fixListIndentation(content) {
  return content.replace(/^(\s*)([-*+]|\d+\.)\s+/gm, (match, spaces, marker) => {
    const indentLevel = Math.floor(spaces.length / 2) * 2;
    return " ".repeat(indentLevel) + marker + " ";
  });
}

/**
 * Generate markdownlint configuration
 */
function generateMarkdownLintConfig() {
  const config = {
    default: true,
    MD001: true, // Heading levels should only increment by one level at a time
    MD002: false, // First heading should be a top-level heading
    MD003: false, // Heading style
    MD004: false, // Unordered list style
    MD005: true, // Inconsistent indentation for list items at the same level
    MD006: false, // Consider starting bulleted lists at the beginning of the line
    MD007: true, // Unordered list indentation
    MD009: true, // Trailing spaces
    MD010: true, // Hard tabs
    MD011: true, // Reversed link syntax
    MD012: false, // Multiple consecutive blank lines
    MD013: false, // Line length
    MD014: true, // Dollar signs used before commands without showing output
    MD018: true, // No space after hash on atx style heading
    MD019: true, // Multiple spaces after hash on atx style heading
    MD020: true, // No space inside hashes on closed atx style heading
    MD021: true, // Multiple spaces inside hashes on closed atx style heading
    MD022: true, // Headings should be surrounded by blank lines
    MD023: true, // Headings must start at the beginning of the line
    MD024: false, // Multiple headings with the same content
    MD025: false, // Multiple top-level headings in the same document
    MD026: false, // Trailing punctuation in heading
    MD027: true, // Multiple spaces after blockquote symbol
    MD028: true, // Blank line inside blockquote
    MD029: false, // Ordered list item prefix
    MD030: false, // Spaces after list markers
    MD031: true, // Blank lines around fenced code blocks
    MD032: true, // Lists should be surrounded by blank lines
    MD033: false, // Inline HTML
    MD034: true, // Bare URL used
    MD035: false, // Horizontal rule style
    MD036: false, // Emphasis used instead of a heading
    MD037: true, // Spaces inside emphasis markers
    MD038: true, // Spaces inside code span elements
    MD039: true, // Spaces inside link text
    MD040: true, // Fenced code blocks should have a language specified
    MD041: false, // First line in a file should be a top-level heading
    MD042: true, // No empty links
    MD043: false, // Required heading structure
    MD044: false, // Proper names should have the correct capitalization
    MD045: true, // Images should have alternate text (alt text)
    MD046: false, // Code block style
    MD047: true, // Files should end with a single newline character
    MD048: false, // Code fence style
    MD049: false, // Emphasis style should be consistent
    MD050: false, // Strong style should be consistent
    MD051: false, // Link fragments should be valid
    MD052: false, // Reference links should be valid
    MD053: false, // Link image reference definitions should be valid
    MD054: false, // Unused link image reference definitions should be removed
    MD055: false, // Table column alignment should be consistent
    MD056: false, // Table cell content should be consistent
    MD057: false, // Table cell content should be consistent
    MD058: false, // Table cell content should be consistent
    MD059: false, // Table cell content should be consistent
    MD060: false, // Table cell content should be consistent
    MD061: false, // Table cell content should be consistent
    MD062: false, // Table cell content should be consistent
    MD063: false, // Table cell content should be consistent
    MD064: false, // Table cell content should be consistent
    MD065: false, // Table cell content should be consistent
    MD066: false, // Table cell content should be consistent
    MD067: false, // Table cell content should be consistent
    MD068: false, // Table cell content should be consistent
    MD069: false, // Table cell content should be consistent
    MD070: false, // Table cell content should be consistent
    MD071: false, // Table cell content should be consistent
    MD072: false, // Table cell content should be consistent
    MD073: false, // Table cell content should be consistent
    MD074: false, // Table cell content should be consistent
    MD075: false, // Table cell content should be consistent
    MD076: false, // Table cell content should be consistent
    MD077: false, // Table cell content should be consistent
    MD078: false, // Table cell content should be consistent
    MD079: false, // Table cell content should be consistent
    MD080: false, // Table cell content should be consistent
    MD081: false, // Table cell content should be consistent
    MD082: false, // Table cell content should be consistent
    MD083: false, // Table cell content should be consistent
    MD084: false, // Table cell content should be consistent
    MD085: false, // Table cell content should be consistent
    MD086: false, // Table cell content should be consistent
    MD087: false, // Table cell content should be consistent
    MD088: false, // Table cell content should be consistent
    MD089: false, // Table cell content should be consistent
    MD090: false, // Table cell content should be consistent
    MD091: false, // Table cell content should be consistent
    MD092: false, // Table cell content should be consistent
    MD093: false, // Table cell content should be consistent
    MD094: false, // Table cell content should be consistent
    MD095: false, // Table cell content should be consistent
    MD096: false, // Table cell content should be consistent
    MD097: false, // Table cell content should be consistent
    MD098: false, // Table cell content should be consistent
    MD099: false, // Table cell content should be consistent
    MD100: false, // Table cell content should be consistent
  };

  const configPath = path.join(PROJECT_ROOT, ".markdownlint.json");
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("📝 Generated .markdownlint.json configuration");
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "check";

  console.log("📝 Century 360 Markdown Linting\n");

  const files = getMarkdownFiles();

  if (files.length === 0) {
    console.log("No markdown files found to process.");
    return;
  }

  console.log(`Found ${files.length} markdown files to process:\n`);
  files.forEach(file => console.log(`  - ${file}`));
  console.log();

  switch (command) {
    case "fix":
      console.log("🔧 Fixing markdown issues...\n");
      const fixedCount = fixMarkdownIssues(files);
      console.log(`\n✅ Fixed ${fixedCount} files`);

      // Run markdownlint to check remaining issues
      console.log("\n🔍 Checking for remaining issues...");
      runMarkdownLint(files.map(f => path.join(PROJECT_ROOT, f)));
      break;

    case "check":
      console.log("🔍 Checking markdown files...\n");
      runMarkdownLint(files.map(f => path.join(PROJECT_ROOT, f)));
      break;

    case "config":
      generateMarkdownLintConfig();
      break;

    case "help":
      console.log("Usage: node scripts/docs-lint.mjs [command]");
      console.log("");
      console.log("Commands:");
      console.log("  check  - Check markdown files for issues (default)");
      console.log("  fix    - Fix common markdown issues");
      console.log("  config - Generate markdownlint configuration");
      console.log("  help   - Show this help message");
      break;

    default:
      console.log(`Unknown command: ${command}`);
      console.log('Run "node scripts/docs-lint.mjs help" for usage information');
      process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

#!/usr/bin/env node

import fs from "fs";
import path from "path";

const MAX_LINE_LENGTH = 80;

/**
 * Fix heading structure issues (MD001)
 * Ensures headings only increment by one level at a time
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
          `  Fixed heading structure at line ${i + 1}: ${currentLevel} -> ${previousLevel + 1}`
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
 * Fix trailing whitespace issues (MD009)
 */
function fixTrailingWhitespace(lines) {
  return lines.map(line => {
    if (line.endsWith(" ") && !line.endsWith("  ")) {
      return line.trimEnd();
    }
    return line;
  });
}

/**
 * Fix line ending issues (MD007)
 * Ensure proper list indentation
 */
function fixListIndentation(lines) {
  return lines.map(line => {
    // Fix unordered list indentation
    const unorderedMatch = line.match(/^(\s*)([-*+])\s+/);
    if (unorderedMatch) {
      const [, spaces, marker] = unorderedMatch;
      const indentLevel = Math.floor(spaces.length / 2) * 2;
      return (
        " ".repeat(indentLevel) + marker + " " + line.substring(spaces.length + marker.length + 1)
      );
    }

    // Fix ordered list indentation
    const orderedMatch = line.match(/^(\s*)(\d+\.)\s+/);
    if (orderedMatch) {
      const [, spaces, marker] = orderedMatch;
      const indentLevel = Math.floor(spaces.length / 2) * 2;
      return (
        " ".repeat(indentLevel) + marker + " " + line.substring(spaces.length + marker.length + 1)
      );
    }

    return line;
  });
}

/**
 * Fix code block formatting (MD014)
 * Ensure proper code block spacing
 */
function fixCodeBlockFormatting(lines) {
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for code blocks
    if (line.startsWith("```")) {
      newLines.push(line);

      // Ensure proper spacing after code block start
      if (i + 1 < lines.length && lines[i + 1].trim() !== "") {
        newLines.push("");
      }
    } else if (line.trim() === "" && i > 0 && lines[i - 1].startsWith("```")) {
      // Remove extra blank lines before code block end
      if (i + 1 < lines.length && lines[i + 1].startsWith("```")) {
        continue;
      }
      newLines.push(line);
    } else {
      newLines.push(line);
    }
  }

  return newLines;
}

function wrapLongLine(line) {
  if (line.length <= MAX_LINE_LENGTH) {
    return line;
  }

  // Don't break code blocks, headers, or lists
  if (line.startsWith("```") || line.startsWith("#")) {
    return line;
  }

  // Handle different types of content
  if (line.startsWith("- ") || line.startsWith("* ")) {
    // List items
    const prefix = line.match(/^[-*]\s*/)[0];
    const content = line.slice(prefix.length);
    if (content.length <= MAX_LINE_LENGTH - prefix.length) {
      return line;
    }

    // Break at word boundaries
    const words = content.split(" ");
    const lines = [];
    let currentLine = prefix;

    for (const word of words) {
      if ((currentLine + word).length > MAX_LINE_LENGTH) {
        lines.push(currentLine.trim());
        currentLine = "  " + word + " "; // Indent continuation
      } else {
        currentLine += word + " ";
      }
    }

    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    return lines.join("\n");
  }

  // Regular text - break at word boundaries
  const words = line.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length > MAX_LINE_LENGTH) {
      if (currentLine) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        // Single long word, can't break
        return line;
      }
    } else {
      currentLine += word + " ";
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines.join("\n");
}

/**
 * Generate a summary of changes made to the file
 */
function generateDiffSummary(originalLines, newLines) {
  const originalCount = originalLines.length;
  const newCount = newLines.length;
  const lineChanges = newCount - originalCount;

  let changes = [];

  if (lineChanges !== 0) {
    changes.push(`${lineChanges > 0 ? "+" : ""}${lineChanges} lines`);
  }

  // Count specific types of changes
  let headingChanges = 0;
  let whitespaceChanges = 0;
  let listChanges = 0;
  let codeBlockChanges = 0;
  let longLineChanges = 0;

  // Simple heuristic to detect change types
  for (let i = 0; i < Math.min(originalLines.length, newLines.length); i++) {
    const original = originalLines[i];
    const newLine = newLines[i];

    if (original !== newLine) {
      if (original.trim() !== newLine.trim()) {
        // Content changed
        if (newLine.startsWith("#")) headingChanges++;
        if (newLine.match(/^\s*[-*+]\s/)) listChanges++;
        if (newLine.includes("```")) codeBlockChanges++;
      } else {
        // Only whitespace changed
        whitespaceChanges++;
      }
    }
  }

  // Count long lines that were wrapped
  for (const line of newLines) {
    if (line.length > MAX_LINE_LENGTH) {
      longLineChanges++;
    }
  }

  if (headingChanges > 0) changes.push(`${headingChanges} headings`);
  if (whitespaceChanges > 0) changes.push(`${whitespaceChanges} whitespace`);
  if (listChanges > 0) changes.push(`${listChanges} lists`);
  if (codeBlockChanges > 0) changes.push(`${codeBlockChanges} code blocks`);
  if (longLineChanges > 0) changes.push(`${longLineChanges} long lines wrapped`);

  return changes.length > 0 ? changes.join(", ") : "formatting only";
}

function processFile(filePath) {
  console.log(`Processing: ${filePath}`);

  const content = fs.readFileSync(filePath, "utf8");
  let lines = content.split("\n");
  let hasChanges = false;

  // Store original lines for comparison and backup
  const originalLines = [...lines];
  const originalContent = content;

  // Fix heading structure
  lines = fixHeadingStructure(lines);

  // Fix trailing whitespace
  lines = fixTrailingWhitespace(lines);

  // Fix list indentation
  lines = fixListIndentation(lines);

  // Fix code block formatting
  lines = fixCodeBlockFormatting(lines);

  // Fix long lines
  const newLines = [];
  for (const line of lines) {
    if (line.length > MAX_LINE_LENGTH) {
      const wrapped = wrapLongLine(line);
      if (wrapped.includes("\n")) {
        newLines.push(...wrapped.split("\n"));
      } else {
        newLines.push(wrapped);
      }
    } else {
      newLines.push(line);
    }
  }

  const newContent = newLines.join("\n");

  // Check if any changes were made
  if (newContent !== originalContent) {
    // Create backup of original file
    const backupPath = `${filePath}.backup`;
    fs.writeFileSync(backupPath, originalContent);

    // Write the fixed content
    fs.writeFileSync(filePath, newContent);

    // Generate diff summary
    const diffSummary = generateDiffSummary(originalLines, newLines);

    console.log(`  Fixed markdown issues`);
    console.log(`  Backup created: ${backupPath}`);
    console.log(`  Changes: ${diffSummary}`);
    hasChanges = true;
  } else {
    console.log(`  No changes needed`);
  }

  return hasChanges;
}

function main() {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const cursorRulesDir = path.join(__dirname, "..", ".cursor", "rules");
  const docsDir = path.join(__dirname, "..", "docs");

  let totalFiles = 0;
  let changedFiles = 0;

  // Process .cursor/rules directory
  if (fs.existsSync(cursorRulesDir)) {
    const ruleFiles = fs
      .readdirSync(cursorRulesDir)
      .filter(file => file.endsWith(".md") || file.endsWith(".mdc"))
      .map(file => path.join(cursorRulesDir, file));

    console.log(`Found ${ruleFiles.length} rule files to process`);
    totalFiles += ruleFiles.length;

    for (const file of ruleFiles) {
      if (processFile(file)) {
        changedFiles++;
      }
    }
  }

  // Process docs directory
  if (fs.existsSync(docsDir)) {
    const docFiles = fs
      .readdirSync(docsDir, { recursive: true })
      .filter(file => typeof file === "string" && (file.endsWith(".md") || file.endsWith(".mdc")))
      .map(file => path.join(docsDir, file));

    console.log(`Found ${docFiles.length} documentation files to process`);
    totalFiles += docFiles.length;

    for (const file of docFiles) {
      if (processFile(file)) {
        changedFiles++;
      }
    }
  }

  console.log(`\n📝 Markdown fixes completed!`);
  console.log(`   Total files processed: ${totalFiles}`);
  console.log(`   Files changed: ${changedFiles}`);

  if (changedFiles > 0) {
    console.log(`\n💡 Tip: Run 'pnpm markdown:lint' to verify all issues are resolved`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

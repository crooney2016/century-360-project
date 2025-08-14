#!/usr/bin/env node

/**
 * Migration Script: Convert UI Components to Chakra UI
 *
 * This script helps identify all UI components in the project and provides
 * guidance for migrating them to Chakra UI.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..");

// Components that have been migrated
const migratedComponents = ["Button", "Input", "Card", "NavLink", "Table"];

// Components that need migration
const componentsToMigrate = [
  "Select", // Has linter errors, needs fixing
  "DataTable",
  "DataToolbar",
  "FilterControls",
  "MultiSelect",
  "ExportButtons",
  "ColumnToggle",
  "Editor",
  "Dialog",
  "ChartLine",
];

// Components that can be removed (replaced by Chakra)
const componentsToRemove = [
  "cn", // Utility function, no longer needed
  "dedupe",
  "UseInfiniteCursorList",
];

console.log("🎯 CHAKRA UI MIGRATION STATUS\n");

console.log("✅ MIGRATED COMPONENTS:");
migratedComponents.forEach(comp => {
  console.log(`  ✓ ${comp}`);
});

console.log("\n🔄 COMPONENTS TO MIGRATE:");
componentsToMigrate.forEach(comp => {
  console.log(`  - ${comp}`);
});

console.log("\n🗑️  COMPONENTS TO REMOVE:");
componentsToRemove.forEach(comp => {
  console.log(`  - ${comp}`);
});

console.log("\n📋 MIGRATION STEPS:");
console.log("1. Fix Select component linter errors");
console.log("2. Migrate Table components to Chakra UI Table");
console.log("3. Migrate form components (MultiSelect, FilterControls)");
console.log("4. Migrate data display components (DataTable, DataToolbar)");
console.log("5. Remove unused utility components");
console.log("6. Update Storybook stories to use Chakra components");
console.log("7. Test all components in the app");

console.log("\n🔧 NEXT STEPS:");
console.log("- Fix Select component issues");
console.log("- Continue with Table components");
console.log("- Update component stories");
console.log("- Test in the application");

console.log("\n💡 TIP: Use Chakra UI Box component as a base for custom components");
console.log('   Example: <Box as="div" p={4} bg="white" borderRadius="md">');

/**
 * Scan project for component files and analyze migration status
 */
function scanProjectComponents() {
  const srcDir = join(PROJECT_ROOT, "src");
  const componentsDir = join(srcDir, "components");

  if (!existsSync(componentsDir)) {
    console.log("\n❌ Components directory not found");
    return;
  }

  console.log("\n🔍 SCANNING PROJECT COMPONENTS...");

  try {
    const componentFiles = readdirSync(componentsDir, { recursive: true })
      .filter(file => typeof file === "string" && file.endsWith(".tsx"))
      .map(file => file.replace(".tsx", ""));

    console.log(`Found ${componentFiles.length} component files`);

    // Analyze migration status with file stats
    const migrated = [];
    const toMigrate = [];
    const toRemove = [];

    componentFiles.forEach(component => {
      const componentPath = join(componentsDir, `${component}.tsx`);
      const stats = statSync(componentPath);

      if (migratedComponents.includes(component)) {
        migrated.push({ name: component, size: stats.size, modified: stats.mtime });
      } else if (componentsToMigrate.includes(component)) {
        toMigrate.push({ name: component, size: stats.size, modified: stats.mtime });
      } else if (componentsToRemove.includes(component)) {
        toRemove.push({ name: component, size: stats.size, modified: stats.mtime });
      }
    });

    console.log(`\n📊 MIGRATION STATUS:`);
    console.log(`  ✅ Migrated: ${migrated.length}/${componentFiles.length}`);
    migrated.forEach(comp =>
      console.log(`    - ${comp.name} (${comp.size} bytes, ${comp.modified.toLocaleDateString()})`)
    );

    console.log(`  🔄 To Migrate: ${toMigrate.length}/${componentFiles.length}`);
    toMigrate.forEach(comp =>
      console.log(`    - ${comp.name} (${comp.size} bytes, ${comp.modified.toLocaleDateString()})`)
    );

    console.log(`  🗑️  To Remove: ${toRemove.length}/${componentFiles.length}`);
    toRemove.forEach(comp =>
      console.log(`    - ${comp.name} (${comp.size} bytes, ${comp.modified.toLocaleDateString()})`)
    );

    // Generate migration report
    generateMigrationReport(componentFiles);
  } catch (error) {
    console.error("Error scanning components:", error);
  }
}

/**
 * Generate detailed migration report
 */
function generateMigrationReport(componentFiles) {
  const reportPath = join(PROJECT_ROOT, "CHAKRA_MIGRATION_REPORT.md");

  // Read existing report if it exists
  let existingContent = "";
  if (existsSync(reportPath)) {
    existingContent = readFileSync(reportPath, "utf8");
  }

  const report = `# Chakra UI Migration Report

Generated: ${new Date().toISOString()}

## Migration Status

- **Total Components**: ${componentFiles.length}
- **Migrated**: ${migratedComponents.length}
- **To Migrate**: ${componentsToMigrate.length}
- **To Remove**: ${componentsToRemove.length}

## Components to Migrate

${componentsToMigrate.map(comp => `- [ ] ${comp}`).join("\n")}

## Migration Priority

1. **High Priority**: Select, DataTable, DataToolbar
2. **Medium Priority**: FilterControls, MultiSelect, ExportButtons
3. **Low Priority**: ColumnToggle, Editor, Dialog, ChartLine

## Next Steps

1. Fix Select component linter errors
2. Migrate Table components to Chakra UI Table
3. Update component stories
4. Test in application

## Previous Report

${existingContent ? "Previous report exists and was updated" : "First report generated"}
`;

  writeFileSync(reportPath, report);
  console.log(`\n📄 Migration report generated: ${reportPath}`);
}

// Run component scan
scanProjectComponents();

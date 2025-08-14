#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";
const ignore = new Set(["node_modules", ".next", ".git", "dist", "build", "docs"]);
function walk(dir: string, prefix = "") {
  const items = fs.readdirSync(dir, { withFileTypes: true }).filter(d => !ignore.has(d.name));
  let out = "";
  for (const d of items) {
    const p = path.join(dir, d.name);
    const line = prefix + "- " + d.name + "\n";
    out += line;
    if (d.isDirectory()) out += walk(p, prefix + "  ");
  }
  return out;
}
const root = process.cwd();
const md = `# Project Tree\n\n${walk(root)}`;
fs.writeFileSync("PROJECT_TREE.md", md);
console.log("Wrote PROJECT_TREE.md");

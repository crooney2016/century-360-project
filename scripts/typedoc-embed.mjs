import fs from "node:fs";
import path from "node:path";

const src = path.join(process.cwd(), "public", "typedoc", "index.html");
const out = path.join(process.cwd(), "public", "typedoc-embed.html");

if (!fs.existsSync(src)) {
  console.error("Run `pnpm ui:docs` after generating TypeDoc (public/typedoc not found).");
  process.exit(1);
}

let html = fs.readFileSync(src, "utf8");
const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let body = m ? m[1] : html;
body = body.replace(/href="\.\/assets\//g, 'href="/typedoc/assets/');
body = body.replace(/src="\.\/assets\//g, 'src="/typedoc/assets/');
fs.writeFileSync(out, body);
console.log("typedoc-embed.html written");

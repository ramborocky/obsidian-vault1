// Builds the single-file app: dist/soma.html, and copies it into the Android project's assets.
//   node build.js
// No dependencies. Everything is inlined so the page works offline, opened straight from disk.
const fs = require("fs");
const path = require("path");

const here = (...p) => path.join(__dirname, ...p);
const read = (p) => fs.readFileSync(p, "utf8");
const pkg = { version: "0.2.0" };

// The daily-note template, so "Save to Obsidian" creates notes exactly like Obsidian would.
const templatePath = here("..", "..", "..", "Templates2", "Daily Note.md");
const template = fs.existsSync(templatePath) ? read(templatePath) : "---\ntags: [daily]\ndate: {{date:YYYY-MM-DD}}\n---\n";

// A closing script tag inside inlined code would end the <script> early.
const safe = (js) => js.replace(/<\/script/gi, "<\\/script");

let html = read(here("src", "index.html"));
const parts = {
  "/*__CSS__*/": read(here("src", "styles.css")),
  "/*__DATA__*/": `window.SOMA_VERSION=${JSON.stringify(pkg.version)};window.SOMA_DAILY_TEMPLATE=${JSON.stringify(template)};`,
  "/*__CONTENT__*/": safe(read(here("src", "content.js"))),
  "/*__ENGINE__*/": safe(read(here("src", "engine.js"))),
  "/*__APP__*/": safe(read(here("src", "app.js"))),
};
for (const [marker, value] of Object.entries(parts)) {
  if (!html.includes(marker)) throw new Error("missing marker " + marker);
  html = html.split(marker).join(value);
}

fs.mkdirSync(here("dist"), { recursive: true });
fs.writeFileSync(here("dist", "soma.html"), html);
const asset = here("android", "app", "src", "main", "assets", "soma.html");
if (fs.existsSync(path.dirname(asset))) fs.writeFileSync(asset, html);
console.log(`dist/soma.html  ${(html.length / 1024).toFixed(1)} KB  v${pkg.version}`);

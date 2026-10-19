// Sets the graph view's colour groups to match areas.css.
//
//   node scripts/graph-colours.js
//
// Run it while Obsidian is CLOSED. Obsidian keeps graph settings in memory and
// writes them back on exit, so a change made while it's open gets overwritten.
// Groups are checked top to bottom and the first match wins, so the two sides
// come first and the neutral areas after them.

const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", ".obsidian", "graph.json");
const rgb = (hex) => parseInt(hex.replace("#", ""), 16);
const paths = (...ps) => ps.map((p) => `path:"${p}"`).join(" OR ");

const groups = [
  // 🟦 MAF side
  [paths("01 Projects/MAF", "Msc. Finance and Economic") + ' OR file:"ACPA(T) NBAA To-Do" OR tag:#maf OR tag:#nbaa', "#1E6E8C"],
  // 🟧 Writing side: fiction and essays
  [paths("01 Projects/Kalemie", "01 Projects/00 Craft Atlas", "01 Projects/00The beat of my hurt",
    "01 Projects/x-factor", "01 Projects/Freedom", "01 Projects/Msasani", "01 Projects/Essays",
    "Short stories", "StoryLine", "02 Characters") + " OR tag:#fiction OR tag:#writing", "#E0451F"],
  // Neutral areas, in muted colours so the two sides stand out
  [paths("01 Projects/Personal/Daily", "01 Projects/Personal/The Game"), "#57A08F"],   // verdigris: days and the game
  [paths("01 Projects/Personal"), "#7A4A6B"],                                          // plum: life admin, Operating Manual
  [paths("01 Projects/Ventures"), "#C89B4A"],                                          // brass: ventures
];

const graph = JSON.parse(fs.readFileSync(file, "utf8"));
graph.colorGroups = groups.map(([query, hex]) => ({ query, color: { a: 1, rgb: rgb(hex) } }));
fs.writeFileSync(file, JSON.stringify(graph, null, 2));
console.log(`Wrote ${groups.length} colour groups to ${file}`);

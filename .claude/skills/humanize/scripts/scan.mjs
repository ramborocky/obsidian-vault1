#!/usr/bin/env node
// humanize/scan.mjs — flag AI writing tells in prose.
// Usage: node scan.mjs <file|dir>... [--json] [--quiet] [--only <category>] [--min <n>]
//
// Signs, not proof. Density is the signal; a single hit is noise.

import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const CATS = ['provenance', 'content', 'language', 'format'];

// --- rules -----------------------------------------------------------------
// Each: [id, category, weight, regex]. Applied per line.
const RULES = [
  // -- provenance: leaked machinery. near-conclusive on its own. ------------
  ['oai-marker',        'provenance', 3, /contentReference|oai_?citation|oaicite|attributableIndex/i],
  ['oai-turn',          'provenance', 3, /\bcite?turn\d+(search|image|news|file)\d+/i],
  ['gemini-cite',       'provenance', 3, /\[cite:\s*\d+(?:\s*,\s*\d+)*\]/i],
  ['gemini-span',       'provenance', 3, /\[span_\d+\]\((?:start|end)_span\)/i],
  ['grok-card',         'provenance', 3, /grok[-_](card|render_citation)/i],
  ['deepseek-bracket',  'provenance', 3, /【\d+†/],
  ['perplexity-tag',    'provenance', 3, /\[(attached_file|web):\s*\d+\]/i],
  ['perplexity-s3',     'provenance', 3, /ppl-ai-file-upload/i],
  ['writing-directive', 'provenance', 3, /:::writing\{variant=/i],
  ['utm-param',         'provenance', 3, /utm_source=(chatgpt\.com|openai|copilot\.com)|referrer=grok\.com/i],
  ['date-placeholder',  'provenance', 3, /\b20\d\d-(XX|xx)-(XX|xx)\b/],
  ['text-placeholder',  'provenance', 2, /\[(?:Your|Insert|Add|Company|Name of)[^\]]{0,40}\]|\((?:Add|Insert) your [^)]{0,40}\)/i],
  ['cutoff-disclaimer', 'provenance', 3, /\b(as of my last (knowledge )?(update|training)|up to my last training|my (training|knowledge) (data|cut-?off)|based on (the )?(available|provided) (information|sources|search results))\b/i],
  ['gap-speculation',   'provenance', 2, /\b(specific details (are|remain) (limited|scarce|unavailable)|not widely (documented|available|disclosed|transcribed)|maintains a low profile|keeps (his|her|their) personal (life|details) private)\b/i],
  ['chat-register',     'provenance', 3, /^\s*(certainly[!,]|of course[!,]|great question|you.re absolutely right)|i hope this helps|would you like me to|let me know if you.d like|here.s a (more )?(detailed )?breakdown/i],

  // -- content: what it says ------------------------------------------------
  ['participial-tail',  'content', 2, /,\s+(highlighting|underscoring|emphasizing|ensuring|reflecting|symbolizing|contributing to|cultivating|fostering|encompassing|enhancing|showcasing|solidifying|cementing|reinforcing|establishing|positioning|demonstrating|illustrating|signaling|signalling|paving the way|marking a|shaping the|making it one of|further \w+ing|allowing \w+ to|helping to)\b/i],
  ['legacy-claim',      'content', 2, /\b(stands as|serves as|is) a (testament|reminder|symbol|hallmark|cornerstone)\b|\b(underscor\w+|highlight\w+|emphasiz\w+) (its|their|the) (importance|significance|role)\b|\breflect\w* (a |the )?broader\b|\b(leaving|left) an indelible mark\b|\bsetting the stage for\b|\bmark(s|ed|ing)? a (pivotal|significant|key|major|turning) (moment|point|shift)\b|\b(evolving|changing|shifting) landscape\b|\brich (tapestry|history|cultural)\b|\bdeeply rooted\b|\benduring (legacy|importance|appeal)\b/i],
  ['pivotal-role',      'content', 2, /\bplay(s|ed|ing)? an? (crucial|pivotal|vital|key|significant|central|important|integral) role\b/i],
  ['puffery',           'content', 1, /\b(boasts? a|nestled (in|among|between)|in the heart of|vibrant (culture|community|scene|city|atmosphere)|renowned for|groundbreaking|state-of-the-art|world-class|diverse array|commitment to (excellence|quality|innovation|sustainability)|exemplif(y|ies)|breathtaking|stunning natural beauty|captivat(es|ing))\b/i],
  ['weasel-attrib',     'content', 2, /\b(experts?|observers?|critics?|analysts?|scholars?|commentators?|researchers?) (have )?(argue|argued|note|noted|said|say|believe|cite|cited|point|pointed|suggest|suggested|regard)\b|\bindustry reports?\b|\bit is widely (regarded|believed|considered|seen|accepted|interpreted)\b|\bwidely (regarded|considered|seen|interpreted) as\b|\b(many|some|several) (believe|argue|consider|contend|maintain)\b|\bstudies (have )?(shown|suggest|indicate)\b/i],
  ['coverage-padding',  'content', 2, /\b(independent coverage|(national|regional|local|international) media outlets|trade publications|been (profiled|featured) in|maintains? an? (active|strong|robust) (social media|digital|online) presence|garner(ed|ing)? (significant |widespread )?(attention|coverage|acclaim|recognition))\b/i],
  ['challenges-coda',   'content', 2, /\bdespite (its|these|the|his|her|their) [\w\s]{0,30}(challenges|obstacles|limitations|setbacks|hurdles)\b|\bfac(es|ed|ing) (several|numerous|various|significant|a number of) challenges\b|^#{1,6}\s*(challenges\b.*|.*\bfuture (outlook|prospects|directions)\b.*)$/i],
  ['awards-heading',    'content', 2, /^#{1,6}\s*(awards and \w+|recognition and \w+|legacy and \w+|impact and \w+|\w+ and recognition)\s*$/i],
  ['definitional-lead', 'content', 1, /^\s*(?:>|\*{0,2})?["“]?[A-Z][\w\s,()-]{2,60}["”]?\*{0,2}\s+refers to\b/],
  ['debate-situating',  'content', 1, /\b(ongoing|broader|wider|public|national) (debate|discussion|conversation)s? (about|surrounding|regarding|over)\b|\bparticipat\w+ in public (discussions|discourse)\b|\bsits? at the (center|centre|intersection) of\b/i],

  // -- language: how it is built --------------------------------------------
  ['ai-vocab',          'language', 1, /\b(delv\w+|tapestr\w+|testament|meticulous\w*|intricac\w+|intricate|interplay|pivotal|bolster\w+|garner\w+|showcas\w+|foster(s|ed|ing)?|underscor\w+|multifacet\w+|myriad|realm of|holistic|seamless\w*|synerg\w+|leverag(e|es|ing)|resonat\w+|robust|nuanced|profound\w*|unwavering|invaluable|paramount|burgeoning|plethora|quintessential)\b/i],
  ['ai-vocab-soft',     'language', 1, /\b(crucial|vibrant|enduring|aligns? with|valuable insights|deep dive|ever-(evolving|changing|growing)|in todays? (world|landscape|environment)|when it comes to|at the end of the day)\b/i],
  ['copula-avoid',      'language', 1, /\b(serves? as|stands? as|functions? as|operates? as|represents? a|acts? as a|boasts?|features? (a|an|the|over|more than|\d)|offers? a (wide|range|variety)|maintains? a)\b/i],
  ['neg-parallel',      'language', 2, /\bnot (just|only|merely|simply) [^.!?]{0,60}\b(but|it.s|they.re|it is)\b|\b(is|are|was|were)n.t (just|only|merely|simply)\b|\bit.s not [^.!?]{0,40}, it.s\b/i],
  ['transition-tic',    'language', 1, /^\s*(Additionally|Moreover|Furthermore|Notably|Importantly|Consequently|Ultimately|Overall|In conclusion|In summary|That said|Indeed)\s*,/],
  ['rule-of-three',     'language', 1, /\b\w+ly \w+, \w+, and \w+\b|\b(?:a|an|the) \w+, \w+, and \w+ (?:approach|style|voice|record|work|design|system|experience|story|film|book)\b/i],

  // -- format ---------------------------------------------------------------
  ['bold-header-list',  'format', 2, /^\s*(?:[-*+•–—]|\d+[.)])\s+\*\*[^*]+\*\*\s*[:：]/],
  ['emoji-heading',     'format', 2, /^#{1,6}\s*[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/u],
  ['spaced-em-dash',    'format', 1, /\s—\s/],
  ['md-fence-leak',     'format', 2, /^```(markdown|wikitext|md)\s*$/i],
];

// --- document-level checks -------------------------------------------------
function docChecks(lines, words) {
  const out = [];
  const per1k = (n) => (words ? (n / words) * 1000 : 0);
  const joined = lines.join('\n');

  const bold = (joined.match(/\*\*[^*\n]+\*\*/g) || []).length;
  if (per1k(bold) > 8) {
    out.push(['bold-density', 'format', 2, 0, `${bold} bold spans (${per1k(bold).toFixed(1)}/1k words)`]);
  }

  const em = (joined.match(/—/g) || []).length;
  if (per1k(em) > 6) {
    out.push(['em-dash-density', 'format', 2, 0, `${em} em dashes (${per1k(em).toFixed(1)}/1k words)`]);
  }

  const SMALL = new Set('a an the and or of in on to for with at by as from but nor is are'.split(' '));
  let h1 = 0, prev = 0, titleCase = 0, andHeads = 0;
  lines.forEach((l, i) => {
    const m = l.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!m) return;
    const lvl = m[1].length;
    const text = m[2];
    if (lvl === 1) h1++;
    if (prev && lvl > prev + 1) out.push(['heading-skip', 'format', 2, i + 1, `H${prev} -> H${lvl}`]);
    prev = lvl;
    const w = text.split(/\s+/).filter(Boolean);
    const major = w.slice(1).filter((x) => !SMALL.has(x.toLowerCase()) && /^[A-Za-z]/.test(x));
    if (major.length >= 2 && major.every((x) => /^[A-Z]/.test(x))) titleCase++;
    if (w.length <= 6 && /\s+and\s+/i.test(text)) andHeads++;
  });
  if (h1 > 1) out.push(['h1-overuse', 'format', 1, 0, `${h1} level-1 headings`]);
  if (titleCase >= 2) out.push(['title-case-headings', 'format', 2, 0, `${titleCase} Title Case headings`]);
  if (andHeads >= 2) out.push(['x-and-y-headings', 'format', 1, 0, `${andHeads} "X and Y" headings`]);

  let breaks = 0;
  lines.forEach((l, i) => { if (i > 4 && /^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l)) breaks++; });
  if (breaks >= 2) out.push(['thematic-breaks', 'format', 1, 0, `${breaks} horizontal rules between sections`]);

  // Curly quotes are checked at document level only. Word, macOS, iOS, LanguageTool and
  // every typeset publication produce them, and fiction dialogue is wall-to-wall curly
  // apostrophes — flagging them per line drowns the real signal. Only the *mix* of curly
  // and straight in one document is worth reporting, and even that is weak.
  const curly = (joined.match(/[“”‘’]/g) || []).length;
  const straight = (joined.match(/["']/g) || []).length;
  if (curly > 3 && straight > 3) {
    out.push(['mixed-quote-style', 'format', 1, 0, `${curly} curly / ${straight} straight — weak signal, check the caveat`]);
  }

  return out;
}

// --- machinery -------------------------------------------------------------
function stripNoise(src) {
  const lines = src.split(/\r?\n/);
  let fence = false, front = false;
  return lines.map((l, i) => {
    if (i === 0 && /^---\s*$/.test(l)) { front = true; return ''; }
    if (front) { if (/^---\s*$/.test(l)) front = false; return ''; }
    if (/^\s*(```|~~~)/.test(l)) { fence = !fence; return ''; }
    if (fence) return '';
    return l;
  });
}

const countWords = (lines) => lines.join(' ').split(/\s+/).filter((w) => /[A-Za-z]/.test(w)).length;

function bandOf(d) {
  if (d < 4) return 'clean';
  if (d < 10) return 'watch';
  if (d < 20) return 'heavy';
  return 'saturated';
}

function scanFile(path, opts) {
  const lines = stripNoise(readFileSync(path, 'utf8'));
  const words = countWords(lines);
  const hits = [];

  lines.forEach((line, i) => {
    if (!line.trim()) return;
    for (const [id, cat, weight, re] of RULES) {
      if (opts.only && cat !== opts.only) continue;
      const m = line.match(re);
      if (!m) continue;
      const at = m.index ?? 0;
      const snip = line.slice(Math.max(0, at - 24), at + m[0].length + 34).trim();
      hits.push({ id, cat, weight, line: i + 1, text: snip });
    }
  });

  for (const [id, cat, weight, ln, note] of docChecks(lines, words)) {
    if (opts.only && cat !== opts.only) continue;
    hits.push({ id, cat, weight, line: ln, text: note });
  }

  // Density counts at most CAP hits per rule. Without this, one habitual tic (spaced em
  // dashes in a dash-heavy writer) contributes hundreds of hits and swamps everything else.
  // Breadth across rules is the real signal; repetition of one rule is a single habit.
  const CAP = 5;
  const seen = new Map();
  let counted = 0;
  for (const h of hits) {
    if (h.cat === 'provenance') continue;
    const n = (seen.get(h.id) || 0) + 1;
    seen.set(h.id, n);
    if (n <= CAP) counted++;
  }
  const prose = hits.filter((h) => h.cat !== 'provenance').length;
  const density = words ? (counted / words) * 1000 : 0;
  const rules = seen.size;
  return { path, words, hits, prose, counted, rules, density, band: bandOf(density), thin: words < 300 };
}

function walk(p, acc = []) {
  if (statSync(p).isFile()) { acc.push(p); return acc; }
  for (const e of readdirSync(p)) {
    if (['.git', 'node_modules', '.obsidian', 'references'].includes(e)) continue;
    const full = join(p, e);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (['.md', '.txt', '.markdown'].includes(extname(e).toLowerCase())) acc.push(full);
  }
  return acc;
}

function usage() {
  console.log(`humanize scan — flag AI writing tells

  node scan.mjs <file|dir>... [options]

  --json          machine-readable output
  --quiet         per-file summary only, no individual hits
  --only <cat>    ${CATS.join(' | ')}
  --min <n>       only report files at or above this density

Density = prose tells per 1000 words.  <4 clean | 4-9 watch | 10-19 heavy | 20+ saturated
Provenance hits are counted separately and are near-conclusive on their own.
Signs, not proof. Judge density, never a single hit.`);
}

// --- cli -------------------------------------------------------------------
const argv = process.argv.slice(2);
const opts = { json: false, quiet: false, only: null, min: 0 };
const targets = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--json') opts.json = true;
  else if (a === '--quiet') opts.quiet = true;
  else if (a === '--only') opts.only = argv[++i];
  else if (a === '--min') opts.min = Number(argv[++i]);
  else if (a === '-h' || a === '--help') { usage(); process.exit(0); }
  else targets.push(a);
}
if (!targets.length) { usage(); process.exit(1); }
if (opts.only && !CATS.includes(opts.only)) {
  console.error(`--only must be one of: ${CATS.join(', ')}`);
  process.exit(1);
}

let files = [];
for (const t of targets) {
  try { files = files.concat(walk(t)); }
  catch (e) { console.error(`skip ${t}: ${e.message}`); }
}

const results = files
  .map((f) => scanFile(f, opts))
  .filter((r) => r.density >= opts.min || r.hits.some((h) => h.cat === 'provenance'))
  .sort((a, b) => b.density - a.density);

if (opts.json) {
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

if (!results.length) { console.log('No files matched.'); process.exit(0); }

const cwd = process.cwd();
const BADGE = { clean: 'CLEAN', watch: 'WATCH', heavy: 'HEAVY', saturated: 'SATURATED' };

for (const r of results) {
  console.log(`\n${relative(cwd, r.path) || r.path}  —  ${r.words.toLocaleString()} words`);
  const prov = r.hits.filter((h) => h.cat === 'provenance');
  if (prov.length) {
    console.log(`\n  ! PROVENANCE (${prov.length}) — leaked tool markup; delete these and re-check any citations they touched`);
    for (const h of prov) {
      console.log(`      ${('L' + h.line).padEnd(7)} ${h.id.padEnd(20)} ${h.text.slice(0, 76)}`);
    }
  }
  if (!opts.quiet) {
    for (const cat of ['content', 'language', 'format']) {
      const hs = r.hits.filter((h) => h.cat === cat);
      if (!hs.length) continue;
      console.log(`\n  ${cat.toUpperCase()} (${hs.length})`);
      const byRule = new Map();
      for (const h of hs) {
        const n = (byRule.get(h.id) || 0) + 1;
        byRule.set(h.id, n);
        if (n <= 8) {
          console.log(`      ${(h.line ? 'L' + h.line : '-').padEnd(7)} ${h.id.padEnd(20)} ${h.text.slice(0, 76)}`);
        } else if (n === 9) {
          console.log(`      ...     ${h.id.padEnd(20)} (more occurrences not listed)`);
        }
      }
    }
  }
  const capped = r.prose !== r.counted ? ` (${r.prose} raw, capped at 5/rule)` : '';
  console.log(`\n  ${r.counted} prose tells${capped} / ${r.words} words = ${r.density.toFixed(1)} per 1k  [${BADGE[r.band]}]  across ${r.rules} rule(s)`);
  if (r.thin) console.log('  note: under 300 words — density is unreliable on samples this short');
  const fmt = r.hits.filter((h) => h.cat === 'format').length;
  const nonProv = r.hits.filter((h) => h.cat !== 'provenance').length;
  if (nonProv >= 4 && fmt / nonProv > 0.8) {
    console.log('  note: almost all hits are formatting habits, not content — likely the writer\'s own style');
  }
}

const tot = results.reduce((a, r) => a + r.hits.length, 0);
const totProv = results.reduce((a, r) => a + r.hits.filter((h) => h.cat === 'provenance').length, 0);
console.log(`\n${results.length} file(s), ${tot} hit(s), ${totProv} provenance.`);
console.log('Signs, not proof — density is the signal. See references/ for what each id means.');

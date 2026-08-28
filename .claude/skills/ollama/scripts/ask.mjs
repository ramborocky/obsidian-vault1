#!/usr/bin/env node
// ollama/ask.mjs — run a prompt against a local Ollama model. Nothing leaves this machine.
// Usage: node ask.mjs [prompt] [--file <path>]... [--model <name>] [--system <text>]
//                     [--temp <n>] [--json] [--quiet] [--list] [--raw]
//
// Reads stdin when no prompt argument is given, so it pipes:
//   cat note.md | node ask.mjs --system "Summarize in 3 bullets."

import { readFileSync, statSync } from 'node:fs';
import { basename } from 'node:path';

const HOST = process.env.OLLAMA_HOST?.replace(/\/$/, '') || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b-32k';

// --- args ------------------------------------------------------------------
const argv = process.argv.slice(2);
const opts = { files: [], temp: null, model: DEFAULT_MODEL };
const positional = [];

for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  switch (a) {
    case '--file':   opts.files.push(argv[++i]); break;
    case '--model':  opts.model = argv[++i]; break;
    case '--system': opts.system = argv[++i]; break;
    case '--temp':   opts.temp = Number(argv[++i]); break;
    case '--json':   opts.json = true; break;
    case '--quiet':  opts.quiet = true; break;
    case '--raw':    opts.raw = true; break;
    case '--list':   opts.list = true; break;
    case '-h':
    case '--help':   opts.help = true; break;
    default:
      if (a.startsWith('--')) die(`unknown flag: ${a}`);
      positional.push(a);
  }
}

function die(msg, code = 1) {
  process.stderr.write(`ask: ${msg}\n`);
  process.exit(code);
}

if (opts.help) {
  process.stdout.write(readFileSync(new URL(import.meta.url)).toString()
    .split('\n').filter(l => l.startsWith('//')).map(l => l.slice(3)).join('\n') + '\n');
  process.exit(0);
}

// --- server reachability ---------------------------------------------------
async function api(path, init) {
  try {
    return await fetch(`${HOST}${path}`, init);
  } catch (e) {
    die(`cannot reach Ollama at ${HOST} — is it running? (${e.cause?.code || e.message})`);
  }
}

if (opts.list) {
  const r = await api('/api/tags');
  const { models = [] } = await r.json();
  if (!models.length) die('no models installed. Pull one: ollama pull qwen3:4b', 0);
  for (const m of models) {
    const gb = (m.size / 1e9).toFixed(1);
    const tools = m.capabilities?.includes('tools') ? ' [tools]' : '';
    process.stdout.write(`${m.name.padEnd(28)} ${gb.padStart(5)} GB${tools}\n`);
  }
  process.exit(0);
}

// --- build the prompt ------------------------------------------------------
const parts = [];

for (const f of opts.files) {
  let body;
  try {
    if (statSync(f).isDirectory()) die(`--file expects a file, got a directory: ${f}`);
    body = readFileSync(f, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') die(`no such file: ${f}`);
    throw e;
  }
  parts.push(`--- ${basename(f)} ---\n${body}`);
}

let inline = positional.join(' ').trim();
if (!inline && !process.stdin.isTTY) {
  inline = await new Promise(res => {
    let d = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', c => (d += c)).on('end', () => res(d.trim()));
  });
}
if (inline) parts.push(inline);

if (!parts.length) die('nothing to send. Give a prompt, --file, or pipe stdin. (--help for usage)');

// --- request ---------------------------------------------------------------
const messages = [];
if (opts.system) messages.push({ role: 'system', content: opts.system });
messages.push({ role: 'user', content: parts.join('\n\n') });

const options = {};
if (opts.temp !== null) {
  if (Number.isNaN(opts.temp)) die('--temp expects a number');
  options.temperature = opts.temp;
}

const started = Date.now();
const res = await api('/api/chat', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    model: opts.model,
    messages,
    stream: !opts.json,
    ...(opts.json ? { format: 'json' } : {}),
    ...(Object.keys(options).length ? { options } : {}),
  }),
});

if (!res.ok) {
  const text = (await res.text()).slice(0, 400);
  if (res.status === 404) {
    die(`model "${opts.model}" not found. Installed models:\n  ` +
        `run: node ask.mjs --list`);
  }
  die(`Ollama returned ${res.status}: ${text}`);
}

// --json uses a single non-streamed response so the payload parses as one object.
if (opts.json) {
  const body = await res.json();
  process.stdout.write((body.message?.content ?? '').trim() + '\n');
  report(body);
  process.exit(0);
}

// --- stream ----------------------------------------------------------------
// At CPU speeds (~5 tok/s) streaming is the difference between "working" and "hung".
let buf = '';
let final = null;
const decoder = new TextDecoder();

for await (const chunk of res.body) {
  buf += decoder.decode(chunk, { stream: true });
  const lines = buf.split('\n');
  buf = lines.pop();
  for (const line of lines) {
    if (!line.trim()) continue;
    let obj;
    try { obj = JSON.parse(line); } catch { continue; }
    if (obj.error) die(obj.error);
    if (obj.message?.content) process.stdout.write(obj.message.content);
    if (obj.done) final = obj;
  }
}
process.stdout.write('\n');
report(final);

function report(f) {
  if (opts.quiet || opts.raw || !f) return;
  const secs = (Date.now() - started) / 1000;
  const out = f.eval_count ?? 0;
  const rate = f.eval_duration ? (out / (f.eval_duration / 1e9)).toFixed(1) : '?';
  process.stderr.write(
    `\n[${opts.model} · ${f.prompt_eval_count ?? '?'} in / ${out} out · ` +
    `${rate} tok/s · ${secs.toFixed(1)}s]\n`
  );
}

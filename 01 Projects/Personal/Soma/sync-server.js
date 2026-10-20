// Soma sync hub. Runs on the PC, keeps the combined copy of every device's Soma data, and
// serves the desktop app. Phones sync with it over the local network: the same Wi-Fi, or the
// phone's own hotspot. No internet is needed.
//
//   node sync-server.js            hub on the local network, port 5178
//   node sync-server.js --open     same, and open the desktop app in the browser
//   node sync-server.js --local    this PC only (nothing on the network can connect)
//   --port=5178  --data=<folder>  --no-obsidian   for testing without touching your real data
//
// Security: requests from this PC's own Soma page need no code. Everything else, meaning the
// phone and anything else on the network, must send the 6-digit sync code, which is shown when
// the hub starts and in the desktop app's Settings. Wrong codes are rate-limited.
// The data file (data/soma-sync.json) is personal and gitignored. Never commit it.
"use strict";
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { exec } = require("child_process");
const E = require("./src/engine.js");
const C = require("./src/content.js");

const VERSION = "0.2.0";
const MAX_BODY = 8 * 1024 * 1024;
const LOCK_AFTER = 5, LOCK_MS = 60 * 1000;

function createHub(opts = {}) {
  const port = opts.port || 5178;
  const dataDir = opts.dataDir || path.join(__dirname, "data");
  const dataFile = path.join(dataDir, "soma-sync.json");
  const appFile = opts.appFile || path.join(__dirname, "dist", "soma.html");
  const vaultDir = opts.vaultDir === undefined ? path.resolve(__dirname, "..", "..", "..") : opts.vaultDir;
  const obsidian = opts.obsidian !== false && vaultDir && fs.existsSync(path.join(vaultDir, "01 Projects"));
  const log = opts.quiet ? () => {} : (...a) => console.log(new Date().toLocaleTimeString(), ...a);
  const now = opts.now || (() => Date.now());

  // ---------- the stored hub ----------
  function freshHub() {
    const s = E.initialState(C, now());
    return Object.assign(s, { hub: true, deviceId: "hub", deviceName: "PC hub", days: {}, daysAt: 0 });
  }
  function load() {
    try {
      const d = JSON.parse(fs.readFileSync(dataFile, "utf8"));
      if (d && d.state && /^\d{6}$/.test(d.pin)) {
        d.state = Object.assign(E.migrate(d.state, C, now()), { hub: true, deviceId: "hub", days: {} });
        d.obsidianSynced = d.obsidianSynced || {};
        return d;
      }
    } catch (e) {
      if (e.code !== "ENOENT") {
        // A damaged file is kept for inspection rather than overwritten.
        const bad = dataFile + ".broken-" + now();
        try { fs.renameSync(dataFile, bad); log("Data file unreadable; moved to", bad); } catch (_) { /* nothing to move */ }
      }
    }
    return { pin: String(crypto.randomInt(0, 1000000)).padStart(6, "0"), state: freshHub(), obsidianSynced: {} };
  }
  let db = load();
  function save() {
    fs.mkdirSync(dataDir, { recursive: true });
    const tmp = dataFile + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(db));
    fs.renameSync(tmp, dataFile);   // atomic on the same disk: a crash never leaves half a file
  }
  if (!fs.existsSync(dataFile)) save();

  // ---------- Obsidian: today's numbers into the daily note ----------
  function writeObsidian() {
    if (!obsidian) return [];
    const written = [];
    const dailyDir = path.join(vaultDir, "01 Projects", "Personal", "Daily");
    const templatePath = path.join(vaultDir, "Templates2", "Daily Note.md");
    // Today and the two days before, so a phone that syncs the morning after still lands.
    for (let back = 0; back < 3; back++) {
      const t = now() - back * E.DAY, dk = E.dayKey(t);
      const props = E.dailyNoteProps(E.peekDay(db.state, dk));
      const prev = db.obsidianSynced[dk] || {};
      const had = Object.keys(prev).length > 0;
      if (had && JSON.stringify(props) === JSON.stringify(prev)) continue;          // nothing new since the last write
      if (!had && !Object.values(props).some(Boolean)) continue;                    // nothing done that day
      const file = path.join(dailyDir, dk + ".md");
      let text = "";
      try { text = fs.readFileSync(file, "utf8"); } catch (_) {
        const d = new Date(t);
        const long = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).replace(",", "");
        try { text = fs.readFileSync(templatePath, "utf8"); } catch (__) { text = "---\ntags: [daily]\ndate: {{date:YYYY-MM-DD}}\n---\n"; }
        text = text.replace(/\{\{date:YYYY-MM-DD\}\}/g, dk).replace(/\{\{date:dddd D MMMM YYYY\}\}/g, long);
      }
      const r = E.mergeFrontmatter(text, props, prev);
      fs.mkdirSync(dailyDir, { recursive: true });
      fs.writeFileSync(file, r.text);
      db.obsidianSynced[dk] = r.synced;
      written.push(dk);
    }
    return written;
  }

  // ---------- who may call ----------
  const failures = new Map();   // ip -> { n, until }
  const isLoopback = (ip) => ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1";
  /** This PC's own Soma page: same machine, our own host name, and not some other website. */
  function trustedLocal(req) {
    if (!isLoopback(req.socket.remoteAddress)) return false;
    const host = String(req.headers.host || "");
    if (host !== `localhost:${port}` && host !== `127.0.0.1:${port}`) return false;   // blocks DNS rebinding
    const origin = req.headers.origin;
    return origin === undefined || origin === "null" || origin === `http://localhost:${port}` || origin === `http://127.0.0.1:${port}`;
  }
  function authorised(req) {
    if (trustedLocal(req)) return { ok: true };
    const ip = req.socket.remoteAddress, f = failures.get(ip);
    if (f && f.until > now()) return { ok: false, status: 429, error: "Too many wrong codes. Wait a minute." };
    const given = String(req.headers["x-soma-pin"] || "");
    const gb = Buffer.from(given), pb = Buffer.from(db.pin);
    const ok = gb.length === pb.length && crypto.timingSafeEqual(gb, pb);
    if (ok) { failures.delete(ip); return { ok: true }; }
    const n = (f && f.until <= now() && f.n >= LOCK_AFTER ? 0 : (f ? f.n : 0)) + 1;
    failures.set(ip, { n, until: n >= LOCK_AFTER ? now() + LOCK_MS : 0 });
    return { ok: false, status: 401, error: "Wrong sync code" };
  }

  // ---------- HTTP ----------
  function send(res, status, body, type = "application/json; charset=utf-8") {
    res.writeHead(status, {
      "Content-Type": type,
      "Cache-Control": "no-store",
      // The phone app is a file:// page, so it calls with Origin "null"; access is controlled
      // by the sync code, not by CORS.
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, X-Soma-Pin",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Private-Network": "true",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
  }
  function readBody(req) {
    return new Promise((resolve, reject) => {
      let size = 0; const chunks = [];
      req.on("data", (c) => {
        size += c.length;
        if (size > MAX_BODY) { reject(Object.assign(new Error("too large"), { status: 413 })); req.destroy(); return; }
        chunks.push(c);
      });
      req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      req.on("error", reject);
    });
  }
  // Real Wi-Fi/Ethernet adapters only: WSL, Hyper-V, VirtualBox and VPN adapters have addresses
  // a phone can't reach, and listing them would just confuse the setup.
  const VIRTUAL = /vEthernet|WSL|Hyper-V|VirtualBox|VMware|docker|Loopback|Bluetooth|Tailscale|ZeroTier|VPN/i;
  function lanAddresses() {
    const out = [];
    for (const [name, list] of Object.entries(os.networkInterfaces())) {
      if (VIRTUAL.test(name)) continue;
      for (const a of list || []) if (a.family === "IPv4" && !a.internal && !a.address.startsWith("169.254.")) out.push(`${a.address}:${port}`);
    }
    return out;
  }
  const looksLikeState = (s) => s && typeof s === "object" && Array.isArray(s.books) && typeof s.days === "object" && Array.isArray(s.events);

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", "http://x");
      if (req.method === "OPTIONS") return send(res, 204, "");
      if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/soma.html")) {
        return send(res, 200, fs.readFileSync(appFile), "text/html; charset=utf-8");
      }
      if (req.method === "GET" && url.pathname === "/api/info") {
        const local = trustedLocal(req);
        // Only this PC's own page is told the code; anyone else must already know it.
        return send(res, 200, { ok: true, app: "soma", version: VERSION, addresses: lanAddresses(), obsidian, pin: local ? db.pin : undefined, devices: local ? Object.values(db.state.peers || {}).map((p) => ({ name: p.name, at: p.at })) : undefined });
      }
      if (req.method === "POST" && url.pathname === "/api/sync") {
        const auth = authorised(req);
        if (!auth.ok) return send(res, auth.status, { ok: false, error: auth.error });
        let incoming;
        try { incoming = JSON.parse(await readBody(req)); } catch (e) { return send(res, e.status || 400, { ok: false, error: e.status === 413 ? "Too much data" : "Not JSON" }); }
        if (!looksLikeState(incoming)) return send(res, 400, { ok: false, error: "That isn't Soma data" });
        if (incoming.hub) return send(res, 400, { ok: false, error: "A hub can't sync with a hub" });
        // Without a stable id every sync would look like a new device and its days would count again.
        if (typeof incoming.deviceId !== "string" || !/^dev-[a-z0-9]{6,32}$/.test(incoming.deviceId)) return send(res, 400, { ok: false, error: "Update Soma on that device first" });
        const merged = E.merge(db.state, E.migrate(incoming, C, now()));
        db.state = Object.assign(merged, { hub: true, deviceId: "hub", deviceName: "PC hub", days: {}, daysAt: 0 });
        let written = [];
        try { written = writeObsidian(); } catch (e) { log("Couldn't write to Obsidian:", e.message); }
        save();
        log(`synced ${incoming.deviceName || "a device"} · ${db.state.events.length} events · ${Object.keys(db.state.peers).length} device(s)${written.length ? " · daily note " + written.join(", ") : ""}`);
        return send(res, 200, { ok: true, state: E.syncPayload(db.state), obsidian, serverTime: now() });
      }
      return send(res, 404, { ok: false, error: "Not found" });
    } catch (e) {
      log("Error:", e.message);
      return send(res, 500, { ok: false, error: "Hub error" });
    }
  });

  return {
    server, port, dataFile, get pin() { return db.pin; }, lanAddresses, obsidian,
    listen(host) { return new Promise((resolve, reject) => { server.once("error", reject); server.listen(port, host, () => resolve(server.address())); }); },
    close() { return new Promise((r) => server.close(() => r())); },
  };
}

module.exports = { createHub, VERSION };

if (require.main === module) {
  const args = process.argv.slice(2);
  const local = args.includes("--local");
  const arg = (name) => { const a = args.find((x) => x.startsWith(name + "=")); return a ? a.slice(name.length + 1) : undefined; };
  const hub = createHub({
    port: arg("--port") ? +arg("--port") : 5178,
    dataDir: arg("--data"),                       // a different data folder, e.g. for testing
    obsidian: !args.includes("--no-obsidian"),    // don't touch the vault's daily notes
  });
  const open = () => { if (args.includes("--open")) exec(`start "" "http://localhost:${hub.port}"`); };
  hub.listen(local ? "127.0.0.1" : "0.0.0.0").then(() => {
    const line = "─".repeat(52);
    console.log(`\n${line}\n  Soma sync hub ${VERSION}\n${line}`);
    console.log(`  Desktop app:   http://localhost:${hub.port}`);
    if (local) console.log("  Network:       off (--local)");
    else {
      console.log("  On your phone: Soma → Settings → Sync with your PC");
      for (const a of hub.lanAddresses()) console.log(`     PC address:  ${a}`);
      console.log(`     Sync code:   ${hub.pin}`);
      console.log("  Same Wi-Fi, or connect this PC to the phone's hotspot. No internet needed.");
    }
    console.log(`  Obsidian:      ${hub.obsidian ? "today's numbers go into your daily note" : "off"}`);
    console.log(`  Keep this window open while you sync. Close it to stop the hub.\n${line}\n`);
    open();
  }).catch((e) => {
    if (e.code === "EADDRINUSE") { console.log(`Soma hub is already running on port ${hub.port}.`); open(); setTimeout(() => process.exit(0), 300); }
    else { console.error(e.message); process.exit(1); }
  });
}

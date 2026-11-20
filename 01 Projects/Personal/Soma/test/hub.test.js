// Run: node --test test/
// The PC sync hub, over real HTTP on this machine, with a throwaway data folder and vault.
const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { createHub } = require("../sync-server.js");
const E = require("../src/engine.js");
const C = require("../src/content.js");

const PORT = 5300 + (process.pid % 400);
const T0 = new Date("2026-10-19T14:00:00").getTime();

function tmpdir(name) { return fs.mkdtempSync(path.join(os.tmpdir(), "soma-" + name + "-")); }
function vault() {
  const v = tmpdir("vault");
  fs.mkdirSync(path.join(v, "01 Projects", "Personal", "Daily"), { recursive: true });
  fs.mkdirSync(path.join(v, "Templates2"));
  fs.writeFileSync(path.join(v, "Templates2", "Daily Note.md"), "---\ntags: [daily]\ndate: {{date:YYYY-MM-DD}}\nwrite_min: 0\nstudy_min: 0\n---\n\n# {{date:dddd D MMMM YYYY}}\n");
  return v;
}
function request(method, pathName, { body, headers = {}, port = PORT } = {}) {
  return new Promise((resolve, reject) => {
    const data = body === undefined ? null : typeof body === "string" ? body : JSON.stringify(body);
    // agent: false, so a connection to the previous test's hub on the same port is never reused.
    const req = http.request({ host: "127.0.0.1", port, method, path: pathName, agent: false,
      headers: { Host: `localhost:${port}`, ...(data ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) } : {}), ...headers } }, (res) => {
      let s = ""; res.on("data", (c) => (s += c)); res.on("end", () => { let j = null; try { j = JSON.parse(s); } catch (_) { /* html */ } resolve({ status: res.statusCode, json: j, text: s, headers: res.headers }); });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}
function device(name) {
  const s = E.initialState(C, T0); s.deviceName = name;
  s.books.forEach((b) => { b.totalPages = 300; b.updatedAt = 1; });
  return s;
}
async function withHub(opts, fn) {
  const appFile = path.join(tmpdir("app"), "soma.html");
  fs.writeFileSync(appFile, "<!doctype html><title>Soma</title>");
  const hub = createHub({ port: PORT, dataDir: tmpdir("data"), appFile, quiet: true, vaultDir: null, now: () => T0 + 60000, ...opts });
  await hub.listen("127.0.0.1");
  try { return await fn(hub); } finally { await hub.close(); }
}

test("serves the desktop app and tells only this PC's page the code", () => withHub({}, async (hub) => {
  const page = await request("GET", "/");
  assert.equal(page.status, 200);
  assert.match(page.text, /<title>Soma/);
  const info = await request("GET", "/api/info");
  assert.equal(info.json.pin, hub.pin);
  assert.match(hub.pin, /^\d{6}$/);
  const outsider = await request("GET", "/api/info", { headers: { Origin: "https://evil.example" } });
  assert.equal(outsider.json.pin, undefined, "another website doesn't get the code");
  const rebind = await request("GET", "/api/info", { headers: { Host: `attacker.example:${PORT}` } });
  assert.equal(rebind.json.pin, undefined, "a rebound host name doesn't get the code");
}));

test("sync needs the code unless it's this PC's own page", () => withHub({}, async (hub) => {
  const body = E.syncPayload(device("PC"));
  assert.equal((await request("POST", "/api/sync", { body })).status, 200, "own page, no Origin");
  assert.equal((await request("POST", "/api/sync", { body, headers: { Origin: "null" } })).status, 200, "own file:// page");
  assert.equal((await request("POST", "/api/sync", { body, headers: { Origin: "https://evil.example" } })).status, 401);
  assert.equal((await request("POST", "/api/sync", { body, headers: { Host: `attacker.example:${PORT}` } })).status, 401);
  assert.equal((await request("POST", "/api/sync", { body, headers: { Origin: "https://evil.example", "X-Soma-Pin": hub.pin } })).status, 200, "the right code works from anywhere");
}));

test("wrong codes are rate-limited", () => withHub({}, async () => {
  const body = E.syncPayload(device("Phone"));
  const h = { Origin: "null", Host: `192.168.1.20:${PORT}` };
  for (let i = 0; i < 5; i++) assert.equal((await request("POST", "/api/sync", { body, headers: { ...h, "X-Soma-Pin": "000000" } })).status, 401);
  const locked = await request("POST", "/api/sync", { body, headers: { ...h, "X-Soma-Pin": "000000" } });
  assert.equal(locked.status, 429);
  assert.equal((await request("POST", "/api/sync", { body, headers: { ...h, "X-Soma-Pin": "12" } })).status, 429, "a wrong-length code doesn't crash it");
}));

test("rejects junk, oversized and id-less uploads", () => withHub({}, async () => {
  assert.equal((await request("POST", "/api/sync", { body: "{not json" })).status, 400);
  assert.equal((await request("POST", "/api/sync", { body: { hello: 1 } })).status, 400);
  const noId = E.syncPayload(device("Old")); delete noId.deviceId;
  assert.equal((await request("POST", "/api/sync", { body: noId })).json.error, "Update Soma on that device first");
  const hubLike = { ...E.syncPayload(device("X")), hub: true };
  assert.equal((await request("POST", "/api/sync", { body: hubLike })).status, 400);
  const big = await request("POST", "/api/sync", { body: JSON.stringify({ books: [], days: {}, events: [], pad: "x".repeat(9 * 1024 * 1024) }) }).catch((e) => ({ status: "reset", e }));
  assert.ok(big.status === 413 || big.status === "reset", `big upload: ${big.status}`);
  assert.equal((await request("GET", "/nope")).status, 404);
}));

test("two devices converge through the hub, and the hub survives a restart", async () => {
  const dataDir = tmpdir("data");
  let pin;
  await withHub({ dataDir }, async (hub) => {
    pin = hub.pin;
    let pc = device("PC"), phone = device("Phone");
    E.complete(pc, C, E.candidates(pc, C, T0).find((c) => c.kind === "read"), { minutes: 25, pageReached: 12 }, T0);
    E.complete(phone, C, E.candidates(phone, C, T0).find((c) => c.kind === "exam"), { minutes: 15, count: 1 }, T0);
    const up = async (dev, headers = {}) => E.merge(dev, (await request("POST", "/api/sync", { body: E.syncPayload(dev), headers })).json.state);
    pc = await up(pc);
    phone = await up(phone, { Origin: "null", Host: `192.168.1.20:${PORT}`, "X-Soma-Pin": hub.pin });
    pc = await up(pc);
    assert.equal(E.totals(pc, C, T0).xp, 13);
    assert.equal(E.totals(phone, C, T0).xp, 13);
  });
  await withHub({ dataDir }, async (hub) => {
    assert.equal(hub.pin, pin, "same code after a restart");
    const fresh = device("Laptop");
    const got = E.merge(fresh, (await request("POST", "/api/sync", { body: E.syncPayload(fresh) })).json.state);
    assert.equal(E.totals(got, C, T0).xp, 13, "a third device gets the history");
  });
});

test("a damaged data file is kept aside, not overwritten", async () => {
  const dataDir = tmpdir("data");
  fs.writeFileSync(path.join(dataDir, "soma-sync.json"), "{half a fi");
  await withHub({ dataDir }, async () => {
    assert.ok(fs.readdirSync(dataDir).some((f) => f.startsWith("soma-sync.json.broken-")));
  });
});

test("writes today's numbers into the Obsidian daily note, adding only what's new", () => {
  const v = vault();
  return withHub({ vaultDir: v }, async (hub) => {
    assert.equal(hub.obsidian, true);
    const dk = E.dayKey(T0 + 60000);
    const note = path.join(v, "01 Projects", "Personal", "Daily", dk + ".md");
    let phone = device("Phone");
    E.complete(phone, C, E.candidates(phone, C, T0).find((c) => c.kind === "read"), { minutes: 25, pageReached: 12 }, T0);
    const sync = async () => { phone = E.merge(phone, (await request("POST", "/api/sync", { body: E.syncPayload(phone) })).json.state); };
    await sync();
    let text = fs.readFileSync(note, "utf8");
    assert.match(text, /study_min: 25/);
    assert.match(text, /# Monday 19 October 2026/, "created from the template");
    // the desktop timer adds 25 writing minutes straight into the note
    fs.writeFileSync(note, text.replace("write_min: 0", "write_min: 25"));
    E.complete(phone, C, E.candidates(phone, C, T0 + 3600000).find((c) => c.kind === "exam"), { minutes: 15, count: 1 }, T0 + 3600000);
    await sync();
    await sync();   // and a sync with nothing new changes nothing
    text = fs.readFileSync(note, "utf8");
    assert.match(text, /study_min: 40/, "25 + 15, not 25 + 40");
    assert.match(text, /write_min: 25/, "the timer's minutes are kept");
    assert.match(text, /exam_q: 1/);
  });
});

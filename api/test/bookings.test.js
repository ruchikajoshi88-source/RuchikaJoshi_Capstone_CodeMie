const test = require("node:test");
const assert = require("node:assert/strict");
const os = require("os");
const path = require("path");
const fs = require("fs");

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "bookings-"));
process.env.DB_PATH = path.join(tmp, "test.sqlite3");

const { app } = require("../src/server");
const { db } = require("../src/db");

let server;
let base;

const valid = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  phone: null,
  tourId: "t1",
  tourName: "City Lights Weekend",
  people: 2,
  travelDate: "2026-12-01",
  notes: null
};

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://localhost:${server.address().port}`;
});

test.after(() => {
  server.close();
  db.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

test("schema uses created_at, not createdAt", () => {
  const cols = db.prepare("PRAGMA table_info(bookings)").all().map((c) => c.name);
  assert.ok(cols.includes("created_at"));
  assert.ok(!cols.includes("createdAt"));
});

test("POST /api/bookings returns 201 and persists", async () => {
  const res = await fetch(`${base}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(valid)
  });
  assert.equal(res.status, 201);
  const { booking } = await res.json();
  assert.ok(booking.id);
  assert.ok(booking.created_at);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM bookings WHERE id = ?").get(booking.id).n, 1);
});

test("POST /api/bookings rejects invalid payload with 400", async () => {
  const res = await fetch(`${base}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...valid, email: "nope" })
  });
  assert.equal(res.status, 400);
});

test("GET /api/bookings returns 200 ordered by created_at DESC, id DESC", async () => {
  const ins = db.prepare(
    `INSERT INTO bookings (id, fullName, email, phone, tourId, tourName, people, travelDate, notes, created_at)
     VALUES (@id, 'A B', 'a@b.co', NULL, 't1', 'X', 1, '2026-12-01', NULL, @created_at)`
  );
  const ts = "2030-01-01T00:00:00.000Z";
  ins.run({ id: "aaa", created_at: ts });
  ins.run({ id: "zzz", created_at: ts });
  ins.run({ id: "mmm", created_at: "2030-01-02T00:00:00.000Z" });

  const res = await fetch(`${base}/api/bookings`);
  assert.equal(res.status, 200);
  const { bookings } = await res.json();
  const ids = bookings.map((b) => b.id).filter((id) => ["aaa", "zzz", "mmm"].includes(id));
  assert.deepEqual(ids, ["mmm", "zzz", "aaa"]);
});

test("POST uses INSERT: a duplicate id is not silently replaced", () => {
  const stmt = db.prepare(
    `INSERT INTO bookings (id, fullName, email, tourId, tourName, people, travelDate, created_at)
     VALUES ('dup', 'A B', 'a@b.co', 't1', 'X', 1, '2026-12-01', '2030-01-01T00:00:00.000Z')`
  );
  stmt.run();
  assert.throws(() => stmt.run(), /UNIQUE|PRIMARY KEY/);
});

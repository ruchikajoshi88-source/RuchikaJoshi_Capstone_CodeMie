const path = require("path");
const Database = require("better-sqlite3");

const dbPath = process.env.DB_PATH || path.join(__dirname, "..", "data.sqlite3");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    fullName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NULL,
    tourId TEXT NOT NULL,
    tourName TEXT NOT NULL,
    people INTEGER NOT NULL,
    travelDate TEXT NOT NULL,
    notes TEXT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_bookings_created_at_id ON bookings (created_at DESC, id DESC);
`);

module.exports = { db };

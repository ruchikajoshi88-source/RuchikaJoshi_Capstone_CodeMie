const path = require("path");
const Database = require("better-sqlite3");

const db = new Database(path.join(__dirname, "..", "data.sqlite3"));

db.pragma("journal_mode = WAL");

db.exec(
`
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
    createdAt TEXT NOT NULL
  );

`
`);

module.exports = { db };

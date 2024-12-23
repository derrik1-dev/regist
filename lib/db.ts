import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db: any = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './registration.db',
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        contact TEXT NOT NULL,
        session TEXT NOT NULL,
        gender TEXT NOT NULL,
        registration_date TEXT NOT NULL,
        registration_time TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_registration_date ON registrations(registration_date)
    `);

    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_full_name ON registrations(full_name)
    `);
  }

  return db;
}

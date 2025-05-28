// electron/db.js
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'monaco-data.db'));

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

function saveContent(content) {
  const stmt = db.prepare(`INSERT INTO files (content) VALUES (?)`);
  stmt.run(content);
}

function getAllContent() {
  return db.prepare(`SELECT * FROM files ORDER BY created_at DESC`).all();
}

module.exports = {
  saveContent,
  getAllContent,
};

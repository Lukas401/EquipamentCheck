const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./equipamentos.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS equipamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      equipamento TEXT,
      modelo TEXT,
      fabricante TEXT,
      tagid TEXT UNIQUE,
      status TEXT,
      dataEntrada TEXT,
      foto TEXT,
      serial TEXT
      ativo INTEGER NOT NULL DEFAULT 1
    )    
  `);
});

module.exports = db;

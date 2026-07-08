const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(
  path.join(__dirname, "../data/mcr.db")
);

console.log("✅ SQLite Database Connected");

module.exports = db;
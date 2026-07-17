const Database = require("better-sqlite3");
const path = require("path");

console.log("Database:", path.resolve(__dirname, "../data/mcr.db"));

const db = new Database(
  path.join(__dirname, "../data/mcr.db")
);

console.log("✅ SQLite Database Connected");

const employeeCount = db.prepare("SELECT COUNT(*) AS count FROM employees").get();
console.log("Employees in SQLite:", employeeCount.count);

module.exports = db;
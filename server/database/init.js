const db = require("./db");

function initializeDatabase() {

    // Employees Table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_no TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();

    // Tablets Table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS tablets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tablet_code TEXT UNIQUE NOT NULL,
            channel_name TEXT NOT NULL,
            status TEXT DEFAULT 'AVAILABLE'
        )
    `).run();

    // Transactions Table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id INTEGER NOT NULL,
            tablet_id INTEGER NOT NULL,
            borrow_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            return_time DATETIME,
            status TEXT DEFAULT 'BORROWED',

            FOREIGN KEY(employee_id) REFERENCES employees(id),
            FOREIGN KEY(tablet_id) REFERENCES tablets(id)
        )
    `).run();

    const tabletCount = db
    .prepare("SELECT COUNT(*) AS count FROM tablets")
    .get();

if (tabletCount.count === 0) {
    const insert = db.prepare(`
        INSERT INTO tablets (tablet_code, channel_name)
        VALUES (?, ?)
    `);

    const tablets = [
        ["TAB001", "Hiru FM"],
        ["TAB002", "Sun FM"],
        ["TAB003", "Gold FM"],
        ["TAB004", "Shaa FM"],
        ["TAB005", "Sooriyan FM"]
    ];

    for (const tablet of tablets) {
        insert.run(...tablet);
    }

    console.log("✅ Default tablets added");
}

    console.log("✅ Database Initialized");
}

module.exports = initializeDatabase;
const db = require("./db");

function initializeDatabase() {

    // Employees
    db.prepare(`
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_no TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();

    // Tablets
    db.prepare(`
        CREATE TABLE IF NOT EXISTS tablets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tablet_code TEXT UNIQUE NOT NULL,
            display_name TEXT NOT NULL
        )
    `).run();

    // Transactions
    db.prepare(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            employee_id INTEGER NOT NULL,
            tablet_id INTEGER NOT NULL,

            borrow_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            return_time DATETIME,

            FOREIGN KEY(employee_id) REFERENCES employees(id),
            FOREIGN KEY(tablet_id) REFERENCES tablets(id)
        )
    `).run();

    const count = db.prepare(
        "SELECT COUNT(*) AS count FROM tablets"
    ).get();

    if (count.count === 0) {

        const insert = db.prepare(`
            INSERT INTO tablets (tablet_code, display_name)
            VALUES (?, ?)
        `);

        const tablets = [

            ["TAB001", "Hiru FM"],
            ["TAB002", "Sun FM"],
            ["TAB003", "Gold FM"],
            ["TAB004", "Shaa FM"],
            ["TAB005", "Sooriyan FM"],
            ["TAB006", "Additional 1"],
            ["TAB007", "Additional 2"]

        ];

        for (const tablet of tablets) {
            insert.run(...tablet);
        }

        console.log("✅ Default tablets added");
    }

    console.log("✅ Database Initialized");
}

module.exports = initializeDatabase;
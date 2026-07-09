const db = require("./db");

function initializeDatabase() {

    // =========================
    // Employees Table
    // =========================
    db.prepare(`
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_no TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();

    // =========================
    // Tablets Table
    // =========================
    db.prepare(`
        CREATE TABLE IF NOT EXISTS tablets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tablet_code TEXT UNIQUE NOT NULL,
            display_name TEXT NOT NULL
        )
    `).run();

    // =========================
    // Transactions Table
    // =========================
    db.prepare(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            employee_id INTEGER NOT NULL,
            tablet_id INTEGER NOT NULL,

            borrow_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            return_time DATETIME,

            FOREIGN KEY (employee_id) REFERENCES employees(id),
            FOREIGN KEY (tablet_id) REFERENCES tablets(id)
        )
    `).run();

    // =========================
    // Seed Tablets
    // =========================
    const tabletCount = db
        .prepare("SELECT COUNT(*) AS count FROM tablets")
        .get();

    if (tabletCount.count === 0) {

        const insertTablet = db.prepare(`
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
            insertTablet.run(...tablet);
        }

        console.log("✅ Default tablets added");
    }

    // =========================
    // Seed Employees
    // =========================
    const employeeCount = db
        .prepare("SELECT COUNT(*) AS count FROM employees")
        .get();

    if (employeeCount.count === 0) {

        const insertEmployee = db.prepare(`
            INSERT INTO employees (employee_no, name)
            VALUES (?, ?)
        `);

        const employees = [
            ["EMP001", "Kasun Perera"],
            ["EMP002", "Nimal Silva"],
            ["EMP003", "Ashan Fernando"]
        ];

        for (const employee of employees) {
            insertEmployee.run(...employee);
        }

        console.log("✅ Default employees added");
    }

    console.log("✅ Database Initialized");
}

module.exports = initializeDatabase;
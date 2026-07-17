const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.post("/verify", (req, res) => {

    const { password } = req.body || {};

    if (password && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {

        return res.json({
            success: true
        });

    }

    return res.status(401).json({
        success: false,
        message: "Invalid admin password."
    });

});

/*
=====================================
EXPORT BACKUP
GET /api/admin/export
=====================================
*/

router.get("/export", (req, res) => {

    const employees = db.prepare(`
        SELECT *
        FROM employees
        ORDER BY id
    `).all();

    const tablets = db.prepare(`
        SELECT *
        FROM tablets
        ORDER BY id
    `).all();

    const transactions = db.prepare(`
        SELECT *
        FROM transactions
        ORDER BY id
    `).all();

    const date = new Date().toISOString().split("T")[0];

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="mcr-backup-${date}.json"`
    );

    res.json({
        employees,
        tablets,
        transactions
    });

});

/*
=====================================
IMPORT BACKUP
POST /api/admin/import
=====================================
*/

router.post("/import", express.json({ limit: "20mb" }), (req, res) => {

    const backup = req.body;

    const employees = Array.isArray(backup?.employees) ? backup.employees : null;
    const tablets = Array.isArray(backup?.tablets) ? backup.tablets : null;
    const transactions = Array.isArray(backup?.transactions) ? backup.transactions : null;

    if (!employees && !tablets && !transactions) {

        return res.status(400).json({
            success: false,
            message: "Backup file must contain employees, tablets, or transactions."
        });

    }

    const insertEmployee = db.prepare(`
        INSERT INTO employees (id, employee_no, name)
        VALUES (?, ?, ?)
    `);

    const insertTablet = db.prepare(`
        INSERT INTO tablets (id, tablet_code, display_name)
        VALUES (?, ?, ?)
    `);

    const insertTransaction = db.prepare(`
        INSERT INTO transactions (id, employee_id, tablet_id, borrow_time, return_time)
        VALUES (?, ?, ?, ?, ?)
    `);

    const restore = db.transaction(() => {

        // Delete children before parents to respect foreign keys.
        db.prepare(`DELETE FROM transactions`).run();
        db.prepare(`DELETE FROM tablets`).run();
        db.prepare(`DELETE FROM employees`).run();

        if (employees) {

            for (const employee of employees) {

                insertEmployee.run(
                    employee.id,
                    employee.employee_no,
                    employee.name
                );

            }

        }

        if (tablets) {

            for (const tablet of tablets) {

                insertTablet.run(
                    tablet.id,
                    tablet.tablet_code,
                    tablet.display_name
                );

            }

        }

        if (transactions) {

            for (const transaction of transactions) {

                insertTransaction.run(
                    transaction.id,
                    transaction.employee_id,
                    transaction.tablet_id,
                    transaction.borrow_time,
                    transaction.return_time ?? null
                );

            }

        }

    });

    try {

        restore();

        return res.json({
            success: true,
            message: "Backup restored successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to restore backup. No changes were made."
        });

    }

});

module.exports = router;

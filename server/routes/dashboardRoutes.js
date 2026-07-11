const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/", (req, res) => {

    const dashboard = db.prepare(`

        SELECT

            tablets.id,
            tablets.tablet_code,
            tablets.display_name,

            employees.name AS employee_name,

            transactions.borrow_time,

            CASE

                WHEN transactions.id IS NULL
                THEN 'AVAILABLE'

                ELSE 'BORROWED'

            END AS status

        FROM tablets

        LEFT JOIN transactions

            ON tablets.id = transactions.tablet_id
            AND transactions.return_time IS NULL

        LEFT JOIN employees

            ON employees.id = transactions.employee_id

        ORDER BY tablets.id

    `).all();

    res.json({

        success: true,

        tablets: dashboard

    });

});

module.exports = router;

/*
=====================================
DASHBOARD STATS
GET /api/dashboard/stats
=====================================
*/

router.get("/stats", (req, res) => {

    const totalTablets = db.prepare(`
        SELECT COUNT(*) AS count
        FROM tablets
    `).get().count;

    const borrowed = db.prepare(`
        SELECT COUNT(*) AS count
        FROM transactions
        WHERE return_time IS NULL
    `).get().count;

    const available = totalTablets - borrowed;

    const employees = db.prepare(`
        SELECT COUNT(*) AS count
        FROM employees
    `).get().count;

    res.json({

        success: true,

        stats: {

            totalTablets,

            available,

            borrowed,

            employees

        }

    });

});
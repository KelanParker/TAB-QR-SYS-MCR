const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/", (req, res) => {

    const history = db.prepare(`
        SELECT

            transactions.id,

            employees.employee_no,
            employees.name AS employee_name,

            tablets.tablet_code,
            tablets.display_name,

            transactions.borrow_time,
            transactions.return_time

        FROM transactions

        JOIN employees
        ON employees.id = transactions.employee_id

        JOIN tablets
        ON tablets.id = transactions.tablet_id

        ORDER BY transactions.borrow_time DESC

    `).all();

    res.json({

        success: true,

        history

    });

});

/*
=====================================
DELETE SINGLE HISTORY RECORD
DELETE /api/history/:id
=====================================
*/

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const transaction = db.prepare(`
        SELECT id
        FROM transactions
        WHERE id = ?
    `).get(id);

    if (!transaction) {

        return res.status(404).json({
            success: false,
            message: "Record not found."
        });

    }

    db.prepare(`
        DELETE FROM transactions
        WHERE id = ?
    `).run(id);

    res.json({
        success: true,
        message: "Record deleted successfully."
    });

});

/*
=====================================
CLEAR ALL HISTORY
DELETE /api/history
=====================================
*/

router.delete("/", (req, res) => {

    db.prepare(`
        DELETE FROM transactions
    `).run();

    res.json({
        success: true,
        message: "History cleared successfully."
    });

});

module.exports = router;

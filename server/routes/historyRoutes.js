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

module.exports = router;
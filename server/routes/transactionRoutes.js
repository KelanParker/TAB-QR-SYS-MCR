const express = require("express");
const router = express.Router();
const db = require("../database/db");
const logActivity = require("../utils/activityLogger");

/*
=====================================
ISSUE TABLETS
POST /api/transactions/issue
=====================================
*/

router.post("/issue", (req, res) => {

    const { employeeCode, tabletCodes } = req.body;

    if (!employeeCode || !Array.isArray(tabletCodes) || tabletCodes.length === 0) {

        return res.status(400).json({
            success: false,
            message: "Employee code and at least one tablet are required."
        });

    }

    const employee = db.prepare(`
        SELECT *
        FROM employees
        WHERE employee_no = ?
    `).get(employeeCode);

    if (!employee) {

        return res.status(404).json({
            success: false,
            message: "Employee not found."
        });

    }

    const insertTransaction = db.prepare(`
        INSERT INTO transactions
        (
            employee_id,
            tablet_id
        )
        VALUES (?, ?)
    `);

    const checkActive = db.prepare(`
        SELECT id
        FROM transactions
        WHERE tablet_id = ?
        AND return_time IS NULL
    `);

    const findTablet = db.prepare(`
        SELECT *
        FROM tablets
        WHERE tablet_code = ?
    `);

    const issuedTablets = [];

    for (const tabletCode of tabletCodes) {

        const tablet = findTablet.get(tabletCode);

        if (!tablet) {

            return res.status(404).json({
                success: false,
                message: `Tablet ${tabletCode} not found.`
            });

        }

        const active = checkActive.get(tablet.id);

        if (active) {

            return res.status(400).json({
                success: false,
                message: `${tablet.display_name} is already issued.`
            });

        }

        insertTransaction.run(
            employee.id,
            tablet.id
        );

        logActivity(
            "ISSUE",
            `${employee.name} issued ${tablet.display_name}`
        );

        issuedTablets.push({
            tabletCode,
            displayName: tablet.display_name
        });

    }

    res.json({
        success: true,

        employee: {
            employee_no: employee.employee_no,
            name: employee.name
        },

        issuedTablets
    });

});


/*
=====================================
GET ACTIVE TABLETS
GET /api/transactions/active/:employeeCode
=====================================
*/

router.get("/active/:employeeCode", (req, res) => {

    const employee = db.prepare(`
        SELECT *
        FROM employees
        WHERE employee_no = ?
    `).get(req.params.employeeCode);

    if (!employee) {

        return res.status(404).json({
            success: false,
            message: "Employee not found."
        });

    }

    const tablets = db.prepare(`
        SELECT

            transactions.id AS transactionId,
            tablets.tablet_code,
            tablets.display_name,
            transactions.borrow_time

        FROM transactions

        JOIN tablets
            ON tablets.id = transactions.tablet_id

        WHERE
            transactions.employee_id = ?
        AND
            transactions.return_time IS NULL

        ORDER BY transactions.borrow_time
    `).all(employee.id);

    res.json({
        success: true,
        employee,
        tablets
    });

});


/*
=====================================
RETURN TABLETS
POST /api/transactions/return
=====================================
*/

router.post("/return", (req, res) => {

    const { transactionIds } = req.body;

    if (!Array.isArray(transactionIds) || transactionIds.length === 0) {

        return res.status(400).json({
            success: false,
            message: "No tablets selected."
        });

    }

    const findTransaction = db.prepare(`
        SELECT *
        FROM transactions
        WHERE id = ?
    `);

    const update = db.prepare(`
        UPDATE transactions
        SET return_time = CURRENT_TIMESTAMP
        WHERE id = ?
    `);

    for (const id of transactionIds) {

        const transaction = findTransaction.get(id);

        if (!transaction) {

            return res.status(404).json({
                success: false,
                message: "Transaction not found."
            });

        }

        if (transaction.return_time !== null) {

            return res.status(400).json({
                success: false,
                message: "This tablet has already been returned."
            });

        }

        update.run(id);

        const activity = db.prepare(`
            SELECT
                tablets.display_name,
                employees.name AS employee_name
            FROM transactions
            JOIN tablets
                ON tablets.id = transactions.tablet_id
            JOIN employees
                ON employees.id = transactions.employee_id
            WHERE transactions.id = ?
        `).get(id);

        logActivity(
            "RETURN",
            `${activity.employee_name} returned ${activity.display_name}`
        );

    }

    res.json({
        success: true,
        message: "Selected tablets returned successfully."
    });

});


/*
=====================================
GET ISSUED TABLET BY CODE
GET /api/transactions/tablet/:tabletCode
=====================================
*/

router.get("/tablet/:tabletCode", (req, res) => {

    const tablet = db.prepare(`
        SELECT *
        FROM tablets
        WHERE tablet_code = ?
    `).get(req.params.tabletCode);

    if (!tablet) {

        return res.status(404).json({
            success: false,
            message: "Tablet not found."
        });

    }

    const transaction = db.prepare(`
        SELECT
            transactions.id AS transactionId,
            tablets.tablet_code,
            tablets.display_name,
            employees.employee_no,
            employees.name,
            transactions.borrow_time
        FROM transactions
        JOIN tablets
            ON tablets.id = transactions.tablet_id
        JOIN employees
            ON employees.id = transactions.employee_id
        WHERE
            transactions.tablet_id = ?
        AND
            transactions.return_time IS NULL
    `).get(tablet.id);

    if (!transaction) {

        return res.status(404).json({
            success: false,
            message: "Tablet is not currently issued."
        });

    }

    res.json({
        success: true,
        transactionId: transaction.transactionId,
        tablet: {
            tablet_code: transaction.tablet_code,
            display_name: transaction.display_name
        },
        employee: {
            employee_no: transaction.employee_no,
            name: transaction.name
        },
        borrow_time: transaction.borrow_time
    });

});

module.exports = router;
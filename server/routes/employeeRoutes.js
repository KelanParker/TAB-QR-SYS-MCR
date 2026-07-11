const express = require("express");
const router = express.Router();
const db = require("../database/db");
const logActivity = require("../utils/activityLogger");

/*
=====================================
GET ALL EMPLOYEES
GET /api/employees
=====================================
*/

router.get("/", (req, res) => {

    const employees = db.prepare(`
        SELECT *
        FROM employees
        ORDER BY employee_no
    `).all();

    res.json({
        success: true,
        employees
    });

});


/*
=====================================
GET EMPLOYEE BY CODE
GET /api/employees/:employeeNo
=====================================
*/

router.get("/:employeeNo", (req, res) => {

    const employee = db.prepare(`
        SELECT *
        FROM employees
        WHERE employee_no = ?
    `).get(req.params.employeeNo);

    if (!employee) {

        return res.status(404).json({
            success: false,
            message: "Employee not found."
        });

    }

    res.json({
        success: true,
        employee
    });

});


/*
=====================================
ADD EMPLOYEE
POST /api/employees
=====================================
*/

router.post("/", (req, res) => {

    const { employee_no, name } = req.body;

    if (!employee_no || !name) {

        return res.status(400).json({
            success: false,
            message: "Employee number and name are required."
        });

    }

    const exists = db.prepare(`
        SELECT id
        FROM employees
        WHERE employee_no = ?
    `).get(employee_no);

    if (exists) {

        return res.status(400).json({
            success: false,
            message: "Employee already exists."
        });

    }

    db.prepare(`
        INSERT INTO employees
        (
            employee_no,
            name
        )
        VALUES (?, ?)
    `).run(employee_no, name);

    // Activity Log
    logActivity(
        "ADD_EMPLOYEE",
        `${employee_no} - ${name}`
    );

    res.json({
        success: true,
        message: "Employee added successfully."
    });

});


/*
=====================================
DELETE EMPLOYEE
DELETE /api/employees/:id
=====================================
*/

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const employee = db.prepare(`
        SELECT *
        FROM employees
        WHERE id = ?
    `).get(id);

    if (!employee) {

        return res.status(404).json({
            success: false,
            message: "Employee not found."
        });

    }

    const hasTransactions = db.prepare(`
    SELECT id
    FROM transactions
    WHERE employee_id = ?
    LIMIT 1
`).get(id);

if (hasTransactions) {

    return res.status(400).json({
        success: false,
        message: "Employee has transaction history and cannot be deleted."
    });

}

    db.prepare(`
        DELETE FROM employees
        WHERE id = ?
    `).run(id);

    // Activity Log
    logActivity(
        "DELETE_EMPLOYEE",
        `${employee.employee_no} - ${employee.name}`
    );

    res.json({
        success: true,
        message: "Employee deleted successfully."
    });

});

module.exports = router;
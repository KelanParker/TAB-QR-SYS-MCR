const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Get employee by employee number
router.get("/:employeeNo", (req, res) => {

    const employee = db.prepare(`
        SELECT *
        FROM employees
        WHERE employee_no = ?
    `).get(req.params.employeeNo);

    if (!employee) {
        return res.status(404).json({
            success: false,
            message: "Employee not found"
        });
    }

    res.json({
        success: true,
        employee
    });

});

module.exports = router;
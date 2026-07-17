const express = require("express");
const router = express.Router();
const db = require("../database/db");

/*
=====================================
GET ACTIVITY LOGS
GET /api/activity
=====================================
*/

router.get("/", (req, res) => {

    const logs = db.prepare(`
        SELECT
            id,
            action,
            details,
            created_at
        FROM activity_logs
        ORDER BY created_at DESC
    `).all();

    res.json({
        success: true,
        logs
    });

});

/*
=====================================
DELETE SINGLE ACTIVITY LOG
DELETE /api/activity/:id
=====================================
*/

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const log = db.prepare(`
        SELECT id
        FROM activity_logs
        WHERE id = ?
    `).get(id);

    if (!log) {

        return res.status(404).json({
            success: false,
            message: "Log not found."
        });

    }

    db.prepare(`
        DELETE FROM activity_logs
        WHERE id = ?
    `).run(id);

    res.json({
        success: true,
        message: "Log deleted successfully."
    });

});

/*
=====================================
CLEAR ALL ACTIVITY LOGS
DELETE /api/activity
=====================================
*/

router.delete("/", (req, res) => {

    db.prepare(`
        DELETE FROM activity_logs
    `).run();

    res.json({
        success: true,
        message: "Activity logs cleared successfully."
    });

});

module.exports = router;

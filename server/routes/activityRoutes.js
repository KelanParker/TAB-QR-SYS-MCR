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

module.exports = router;
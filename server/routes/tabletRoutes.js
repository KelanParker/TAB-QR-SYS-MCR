const express = require("express");
const router = express.Router();
const db = require("../database/db");
const logActivity = require("../utils/activityLogger");

/*
=====================================
GET ALL TABLETS
GET /api/tablets
=====================================
*/

router.get("/", (req, res) => {

    const tablets = db.prepare(`
        SELECT
            id,
            tablet_code,
            display_name
        FROM tablets
        ORDER BY id
    `).all();

    res.json({
        success: true,
        tablets
    });

});


/*
=====================================
ADD TABLET
POST /api/tablets
=====================================
*/

router.post("/", (req, res) => {

    const { tablet_code, display_name } = req.body;

    if (!tablet_code || !display_name) {

        return res.status(400).json({
            success: false,
            message: "Tablet code and display name are required."
        });

    }

    const exists = db.prepare(`
        SELECT id
        FROM tablets
        WHERE tablet_code = ?
    `).get(tablet_code);

    if (exists) {

        return res.status(400).json({
            success: false,
            message: "Tablet already exists."
        });

    }

    db.prepare(`
        INSERT INTO tablets
        (
            tablet_code,
            display_name
        )
        VALUES (?, ?)
    `).run(tablet_code, display_name);

    // Activity Log
    logActivity(
        "ADD_TABLET",
        `${tablet_code} - ${display_name}`
    );

    res.json({
        success: true,
        message: "Tablet added successfully."
    });

});


/*
=====================================
DELETE TABLET
DELETE /api/tablets/:id
=====================================
*/

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const tablet = db.prepare(`
        SELECT *
        FROM tablets
        WHERE id = ?
    `).get(id);

    if (!tablet) {

        return res.status(404).json({
            success: false,
            message: "Tablet not found."
        });

    }

    const hasTransactions = db.prepare(`
    SELECT id
    FROM transactions
    WHERE tablet_id = ?
    LIMIT 1
`).get(id);

if (hasTransactions) {

    return res.status(400).json({
        success: false,
        message: "Tablet has transaction history and cannot be deleted."
    });

}

    db.prepare(`
        DELETE FROM tablets
        WHERE id = ?
    `).run(id);

    // Activity Log
    logActivity(
        "DELETE_TABLET",
        `${tablet.tablet_code} - ${tablet.display_name}`
    );

    res.json({
        success: true,
        message: "Tablet deleted successfully."
    });

});

module.exports = router;
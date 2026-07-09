const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Get tablet by tablet code
router.get("/:tabletCode", (req, res) => {

    const tablet = db.prepare(`
        SELECT *
        FROM tablets
        WHERE tablet_code = ?
    `).get(req.params.tabletCode);

    if (!tablet) {
        return res.status(404).json({
            success: false,
            message: "Tablet not found"
        });
    }

    res.json({
        success: true,
        tablet
    });

});

module.exports = router;
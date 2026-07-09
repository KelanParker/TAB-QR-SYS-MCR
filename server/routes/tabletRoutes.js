const express = require("express");
const router = express.Router();

const db = require("../database/db");

router.get("/", (req, res) => {

    const tablets = db.prepare(`
        SELECT
            id,
            tablet_code,
            display_name
        FROM tablets
        ORDER BY id
    `).all();

    res.json(tablets);

});

module.exports = router;
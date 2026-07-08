const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/", (req, res) => {
    const tablets = db
        .prepare("SELECT * FROM tablets")
        .all();

    res.json(tablets);
});

module.exports = router;
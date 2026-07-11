const db = require("../database/db");

function logActivity(action, details) {

    db.prepare(`
        INSERT INTO activity_logs
        (
            action,
            details
        )
        VALUES (?, ?)
    `).run(action, details);

}

module.exports = logActivity;
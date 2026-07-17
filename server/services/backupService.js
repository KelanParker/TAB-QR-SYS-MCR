const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const db = require("../database/db");

const BACKUP_DIR = path.join(
    __dirname,
    "..",
    process.env.BACKUP_DIRECTORY || "backups"
);

const MAX_BACKUPS = parseInt(process.env.MAX_BACKUPS || "30", 10);

const AUTO_BACKUP_ENABLED =
    process.env.AUTO_BACKUP_ENABLED === "true";

const AUTO_BACKUP_CRON =
    process.env.AUTO_BACKUP_CRON || "0 */6 * * *";

const BACKUP_VERSION = "1.0";

/*
=====================================
ENSURE BACKUP FOLDER EXISTS
=====================================
*/

function ensureBackupDir() {

    if (!fs.existsSync(BACKUP_DIR)) {

        fs.mkdirSync(BACKUP_DIR, { recursive: true });

    }

}

/*
=====================================
BUILD BACKUP DATA
Same shape as the existing Export Backup,
plus activity_logs, history, version, and exportedAt.
=====================================
*/

function buildBackupData() {

    const employees = db.prepare(`
        SELECT *
        FROM employees
        ORDER BY id
    `).all();

    const tablets = db.prepare(`
        SELECT *
        FROM tablets
        ORDER BY id
    `).all();

    const transactions = db.prepare(`
        SELECT *
        FROM transactions
        ORDER BY id
    `).all();

    const activity_logs = db.prepare(`
        SELECT *
        FROM activity_logs
        ORDER BY id
    `).all();

    const history = db.prepare(`
        SELECT

            transactions.id,

            employees.employee_no,
            employees.name AS employee_name,

            tablets.tablet_code,
            tablets.display_name,

            transactions.borrow_time,
            transactions.return_time

        FROM transactions

        JOIN employees
            ON employees.id = transactions.employee_id

        JOIN tablets
            ON tablets.id = transactions.tablet_id

        ORDER BY transactions.borrow_time DESC
    `).all();

    return {
        employees,
        tablets,
        transactions,
        activity_logs,
        history,
        version: BACKUP_VERSION,
        exportedAt: new Date().toISOString()
    };

}

/*
=====================================
FORMAT FILENAME TIMESTAMP
backup-YYYY-MM-DD-HH-mm.json
=====================================
*/

function formatTimestamp(date) {

    const pad = (value) => String(value).padStart(2, "0");

    return (
        date.getFullYear() +
        "-" + pad(date.getMonth() + 1) +
        "-" + pad(date.getDate()) +
        "-" + pad(date.getHours()) +
        "-" + pad(date.getMinutes()) +
        "-" + pad(date.getSeconds())
    );

}

/*
=====================================
DELETE OLDER BACKUPS
Keep only the newest MAX_BACKUPS files.
=====================================
*/

function cleanupOldBackups() {

    const files = fs.readdirSync(BACKUP_DIR)
        .filter((file) => file.startsWith("backup-") && file.endsWith(".json"))
        .map((file) => {

            const fullPath = path.join(BACKUP_DIR, file);

            return {
                name: file,
                fullPath,
                time: fs.statSync(fullPath).mtimeMs
            };

        })
        .sort((a, b) => b.time - a.time);

    if (files.length > MAX_BACKUPS) {

        const filesToDelete = files.slice(MAX_BACKUPS);

        for (const file of filesToDelete) {

            fs.unlinkSync(file.fullPath);

        }

        console.log("✓ Old backups removed");

    }

}

/*
=====================================
CREATE A SINGLE BACKUP
label: "Startup" or "Scheduled" — used only for the console log text.
=====================================
*/

function createBackup(label) {

    try {

        ensureBackupDir();

        const data = buildBackupData();
        const filename = `backup-${formatTimestamp(new Date())}.json`;
        const filePath = path.join(BACKUP_DIR, filename);

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        cleanupOldBackups();

        console.log(`✓ ${label} backup created`);

    } catch (error) {

        console.error(`✗ Failed to create ${label.toLowerCase()} backup:`, error);

    }

}

/*
=====================================
START THE AUTOMATIC BACKUP SERVICE
- Ensures the backup folder exists.
- Creates one backup immediately.
- Schedules a backup every 6 hours.
=====================================
*/
/*
=====================================
START THE AUTOMATIC BACKUP SERVICE
=====================================
*/

function startBackupService() {

    ensureBackupDir();

    // Create a startup backup only in production
    if (process.env.NODE_ENV === "production") {
        createBackup("Startup");
    }

    if (AUTO_BACKUP_ENABLED) {

        cron.schedule(AUTO_BACKUP_CRON, () => {
            createBackup("Scheduled");
        });

        console.log(`✓ Automatic backup service started (${AUTO_BACKUP_CRON})`);

    } else {

        console.log("⚠ Automatic backup service is disabled.");

    }

}

module.exports = {
    startBackupService,
    createBackup
};
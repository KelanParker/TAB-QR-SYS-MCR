const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./database/db");
const initializeDatabase = require("./database/init");
const tabletRoutes = require("./routes/tabletRoutes");

const app = express();

initializeDatabase();

app.use(cors());
app.use(express.json());

app.use("/api/tablets", tabletRoutes);

app.get("/", (req, res) => {
    res.send("MCR Tablet Management Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
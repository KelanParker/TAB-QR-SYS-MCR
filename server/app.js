const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./database/db");
const initializeDatabase = require("./database/init");
const tabletRoutes = require("./routes/tabletRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const tabletLookupRoutes = require("./routes/tabletLookupRoutes");  
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();

initializeDatabase();

app.use(cors());
app.use(express.json());

app.use("/api/tablets", tabletRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tablets/lookup", tabletLookupRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/history", historyRoutes);


app.get("/", (req, res) => {
    res.send("MCR Tablet Management Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Import ticket routes
const ticketRoutes = require("./routes/tickets");

// Root endpoint
app.get("/", (req, res) => {
    res.send("IT Support Ticketing System API");
});

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Backend server is running",
        service: "IT Support Ticketing API"
    });
});

// Ticket API routes
app.use("/api/tickets", ticketRoutes);

// Start server
const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});

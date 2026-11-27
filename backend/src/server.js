
const express = require("express");

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
    res.send("IT Support Ticketing System API");
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Backend server is running",
        service: "IT Support Ticketing API"
    });
});

// Server port
const PORT = 3000;

// Start the server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});

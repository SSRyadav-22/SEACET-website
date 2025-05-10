// Import required modules
const express = require("express");
const cors = require("cors");
const path = require("path"); // Added to serve static files

const app = express();
const port = 3000; // Define port

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors({
    origin: "http://localhost:8080" // Allow requests from live-server port
}));

// Serve static files (HTML, CSS, JS) from the parent directory
app.use(express.static(path.join(__dirname, "..")));

// Endpoint to simulate sending complaint email
app.post("/send-complaint", (req, res) => {
    const { letter, studentId } = req.body;
    // Simulate email sending (in a real app, use Nodemailer or similar)
    console.log(`Simulated email sent for ${studentId}:\n${letter}`);
    res.json({ message: "Complaint email sent successfully" });
});

// Start server with error handling
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${port} is in use. Try a different port or close the other application.`);
    } else {
        console.error("Server error:", err.message);
    }
});
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Health check - useful for Docker and load balancers
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        application: "SkyBook Flight Booking",
        timestamp: new Date().toISOString()
    });
});

// Demo booking API
app.post("/api/book", (req, res) => {
    const {
        from,
        to,
        departure,
        passengers,
        travelClass
    } = req.body;

    // Validate required fields
    if (!from || !to || !departure || !passengers) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required booking details."
        });
    }

    // Generate demo booking ID
    const bookingId =
        "SKY-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

    // Return booking response
    res.json({
        success: true,
        bookingId,
        message: "Flight booked successfully!",
        details: {
            from,
            to,
            departure,
            passengers,
            travelClass
        }
    });
});

// Fallback route
// Express 5 does not support app.get("*", ...)
// so app.use() is used instead.
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✈️ SkyBook running on port ${PORT}`);
});


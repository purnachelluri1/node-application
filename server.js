const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Health check - useful when working with Docker
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

    if (!from || !to || !departure || !passengers) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required booking details."
        });
    }

    const bookingId =
        "SKY-" +
        Math.random().toString(36).substring(2, 8).toUpperCase();

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

// Fallback
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✈️ SkyBook running on port ${PORT}`);
});


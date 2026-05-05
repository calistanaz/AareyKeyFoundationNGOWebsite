const express = require("express");
const cors = require("cors");

const assignRoutes = require("./routes/assignRoutes");
const authRoutes = require("./routes/authRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const eventRoutes = require("./routes/eventRoutes");
const donationRoutes = require("./routes/donationRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // FE port
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api", assignRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api", contactRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
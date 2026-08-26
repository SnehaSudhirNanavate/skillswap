const express = require("express");
const cors = require("cors");

const app = express();

// Render provides PORT automatically
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Home
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillSwap Backend is Running 🚀"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillSwap backend is healthy",
    server: "online",
    port: PORT
  });
});

// API test
app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillSwap API is working correctly"
  });
});

// Profile test
app.post("/api/profile", (req, res) => {
  const profile = req.body;

  res.status(201).json({
    success: true,
    message: "Profile received successfully",
    profile: profile
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("======================================");
  console.log("       SKILLSWAP BACKEND 🚀");
  console.log("======================================");
  console.log(`Server running on port ${PORT}`);
  console.log("SERVER IS READY...");
  console.log("======================================");
});
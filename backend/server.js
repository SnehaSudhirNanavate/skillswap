const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5050;

// Basic middleware
app.use(cors());
app.use(express.json());

// IMPORTANT: these routes do not use MongoDB,
// authentication, or any other middleware.

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

// Simple profile test
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
app.listen(PORT, "127.0.0.1", () => {
  console.log("");
  console.log("======================================");
  console.log("       SKILLSWAP BACKEND 🚀");
  console.log("======================================");
  console.log(`Server: http://127.0.0.1:${PORT}`);
  console.log(`Health: http://127.0.0.1:${PORT}/api/health`);
  console.log(`Test:   http://127.0.0.1:${PORT}/api/test`);
  console.log("======================================");
  console.log("SERVER IS READY...");
  console.log("");
});
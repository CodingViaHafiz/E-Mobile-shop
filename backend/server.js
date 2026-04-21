import express from "express";
import dotenv from "dotenv";
import corsMiddleware from "./middleware/corsConfig.js";
import errorHandler from "./middleware/errorHandler.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Basic Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Error Handling Middleware (must be last)
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

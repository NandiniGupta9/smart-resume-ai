require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/authRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/analyze", analysisRoutes);
app.use("/api/analyses", historyRoutes);

// Unknown /api routes return JSON 404
app.use("/api", (req, res) => res.status(404).json({ message: "API route not found." }));

//  Express also serves the built React app 
const clientBuild = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  
  app.get("*", (req, res) => res.sendFile(path.join(clientBuild, "index.html")));
}

// Catch all error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
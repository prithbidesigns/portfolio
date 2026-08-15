const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Media upload routes
const cloudinaryUploadRoutes = require("./routes/cloudinaryUploadRoutes");

// Routes
const projectRoutes = require("./routes/projectRoutes");
const profileRoutes = require("./routes/profileRoutes");
const skillsRoutes = require("./routes/skillsRoutes");
const awardsRoutes = require("./routes/awardsRoutes");
const blogsRoutes = require("./routes/blogsRoutes");
const clientsRoutes = require("./routes/clientsRoutes");
const experiencesRoutes = require("./routes/experiencesRoutes");
const affiliatesRoutes = require("./routes/affiliatesRoutes");
const testimonialsRoutes = require("./routes/testimonialsRoutes");
const emailRoutes = require("./routes/emailRoutes");

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Init
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware to authenticate admin (stateless JWT — no server-side session store,
// so it works across restarts, redeploys, and multiple server instances)
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    jwt.verify(token, SECRET_KEY);
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Token expired or invalid. Please log in again." });
  }
};

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  if (username !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "30m" });
  return res.status(200).json({ message: "Login successful", token });
});

app.post("/api/admin/logout", authenticateAdmin, (req, res) => {
  // Stateless JWTs can't be revoked server-side; the client discards the token.
  res.status(200).json({ message: "Logged out successfully" });
});

// Protected Routes
app.use("/api/projects", projectRoutes(authenticateAdmin));
app.use("/api/profile", profileRoutes(authenticateAdmin));
app.use("/api/skills", skillsRoutes(authenticateAdmin));
app.use("/api/awards", awardsRoutes(authenticateAdmin));
app.use("/api/blogs", blogsRoutes(authenticateAdmin));
app.use("/api/clients", clientsRoutes(authenticateAdmin));
app.use("/api/experiences", experiencesRoutes(authenticateAdmin));
app.use("/api/affiliates", affiliatesRoutes(authenticateAdmin));
app.use("/api/testimonials", testimonialsRoutes(authenticateAdmin));
app.use("/api/uploads", cloudinaryUploadRoutes(authenticateAdmin));

// Public Routes
app.use("/api/email", emailRoutes());

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: "Internal server error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

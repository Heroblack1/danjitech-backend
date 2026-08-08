const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: [
      "danjitech.com",
      "www.danjitech.com",
      "https://danjitech.com",
      "http://localhost:5173",
      "https://www.danjitech.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body parser
app.use(express.json());

// Routes
const contactRoutes = require("./routes/contactRoute");
const adminRoutes = require("./routes/admin");

app.use("/contact", contactRoutes);
app.use("/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("DanjiTech backend is running!");
});

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

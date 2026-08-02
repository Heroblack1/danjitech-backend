const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Contact = require("../models/contact");

const router = express.Router();

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

// =========================
// ADMIN LOGIN
// =========================

console.log("ADMIN PASSWORD HASH:", process.env.ADMIN_PASSWORD_HASH);
console.log("JWT SECRET EXISTS:", !!process.env.JWT_SECRET);

router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required.",
      });
    }

    const passwordCorrect = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Invalid password.",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
      },
      JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    res.json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Server error.",
    });
  }
});

// =========================
// AUTHENTICATION MIDDLEWARE
// =========================

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

// =========================
// GET CONTACTS
// =========================

router.get("/contacts", authenticateAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json({
      contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    res.status(500).json({
      message: "Failed to retrieve contacts.",
    });
  }
});

// =========================
// DELETE CONTACT
// =========================

router.delete("/contacts/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({
        message: "Contact not found.",
      });
    }

    res.json({
      message: "Contact deleted successfully.",
    });
  } catch (error) {
    console.error("Delete contact error:", error);

    res.status(500).json({
      message: "Failed to delete contact.",
    });
  }
});

module.exports = router;

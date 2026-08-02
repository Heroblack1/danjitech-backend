const express = require("express");
const Contact = require("../models/contact");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Contact form received:");
    console.log(req.body);

    const { name, email, company, service, budget, message } = req.body;

    // Check required fields
    if (!name || !email || !company || !service || !budget || !message) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    // Create contact
    const contact = new Contact({
      name,
      email,
      company,
      service,
      budget,
      message,
    });

    // Save to MongoDB
    const savedContact = await contact.save();

    res.status(201).json({
      message: "Contact form submitted successfully.",
      contact: savedContact,
    });
  } catch (error) {
    console.error("Contact submission error:", error);

    res.status(500).json({
      message: "Failed to submit contact form.",
    });
  }
});

module.exports = router;

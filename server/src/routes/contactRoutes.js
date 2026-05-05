const express = require("express");
const router = express.Router();

const { createMessage, getMessages } = require("../controllers/contactController");

router.post("/contact", createMessage);
router.get("/contact", getMessages);

module.exports = router;

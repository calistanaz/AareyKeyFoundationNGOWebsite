const express = require("express");
const router = express.Router();
const prisma = require("../../prisma/client");
const { createEvent, getEvent, deleteEvent } = require("../controllers/eventController");

router.post("/", createEvent);
router.get("/", getEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
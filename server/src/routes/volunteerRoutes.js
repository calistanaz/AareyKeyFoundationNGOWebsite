const express = require("express");
const router = express.Router();
const { getVolunteers,updateAvailability, updateStatus } = require("../controllers/volunteerController");

router.put("/availability", updateAvailability);
router.get("/volunteers", getVolunteers);

module.exports = router;
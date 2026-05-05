const express = require("express");
const router = express.Router();
const prisma = require("../../prisma/client");

const { createDonation, getDonation } = require("../controllers/donationController");

router.post("/", createDonation);
router.get("/", getDonation);

module.exports = router;
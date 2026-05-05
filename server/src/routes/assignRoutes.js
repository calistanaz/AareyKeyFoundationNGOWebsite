const express = require("express");
const router = express.Router();

const { assignTask, getAssignmentsAdm, getAssignmentsVol, updateTaskStatus } = require("../controllers/assignController");

// CREATE
router.post("/assign", assignTask);

// ADMIN - all assignments
router.get("/assign", getAssignmentsAdm);

// VOLUNTEER - specific assignments
router.get("/assign/:email", getAssignmentsVol);

// UPDATE STATUS
router.put("/assign/:id", updateTaskStatus);

module.exports = router;
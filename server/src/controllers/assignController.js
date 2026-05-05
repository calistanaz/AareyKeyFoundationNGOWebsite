const prisma = require("../../prisma/client");

const assignTask = async (req, res) => { //  FIX: Destructure volunteerEmail and task from req.body
  try {
    const { volunteerEmail, task } = req.body; // Extract volunteerEmail and task from the request body

    const newAssignment = await prisma.assignment.create({  // Create a new assignment in the database
      data: {
        volunteerEmail,
        task,
        status: "assigned", // Default status when assigned
      },  
    });

    res.json(newAssignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error assigning task" });  //Internal Server Error
  }
};

const getAssignmentsAdm = async (req, res) => { 
  try {
    const { email } = req.params;  // Extract volunteer email from request parameters

    const assignments = await prisma.assignment.findMany({ // Fetch assignments for the specific volunteer
      where: {
        volunteerEmail: email,
      },
    });

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

const getAssignmentsVol = async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany();
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.assignment.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update status" });
  }
};

module.exports = { assignTask, getAssignmentsAdm, getAssignmentsVol, updateTaskStatus }
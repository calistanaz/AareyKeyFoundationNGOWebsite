const prisma = require("../../prisma/client")

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await prisma.volunteer.findMany(); 
    res.json(volunteers);
  } catch (error) {
    console.error("ERROR FETCHING VOLUNTEERS:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateAvailability = async (req, res) => {
  try {
    let { email, availability } = req.body;

    email = email.trim().toLowerCase();

    const existing = await prisma.volunteer.findUnique({
      where: { email },
    });

    if (!existing) {
      return res.status(404).json({ error: "Volunteer not found" });
    }

    const updated = await prisma.volunteer.update({
      where: { email },
      data: { availability },
    });

    res.json(updated);
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Failed to update availability" });
  }
};

const updateStatus = async (id, status) => {
  await fetch(`http://localhost:5000/api/assign/status/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  fetchAssignments(); // refresh UI
};

module.exports = { getVolunteers, updateAvailability, updateStatus };
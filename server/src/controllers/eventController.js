const prisma = require("../../prisma/client");

const createEvent =  async (req, res) => {
  try {
    const data = await prisma.event.create({
      data: req.body,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const data = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await prisma.event.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createEvent, getEvent, deleteEvent }
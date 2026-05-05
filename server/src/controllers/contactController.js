const prisma = require("../../prisma/client");

// CREATE MESSAGE
const createMessage = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { name, email, subject, message } = req.body;

    const newMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    res.json(newMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// GET ALL MESSAGES (ADMIN)
const getMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createMessage, getMessages };
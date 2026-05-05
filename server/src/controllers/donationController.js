const prisma = require("../../prisma/client");

const createDonation = async (req, res) => {
  try {
    const { name, email, feedback, amount } = req.body; //  include amount

    const donation = await prisma.donation.create({
      data: {
        name,
        email,
        feedback,
        amount: parseFloat(amount),
      },
    });

    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDonation =  async (req, res) => {
  const data = await prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(data);
};

module.exports = { createDonation, getDonation }
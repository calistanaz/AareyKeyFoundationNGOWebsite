const { PrismaClient } = require("@prisma/client"); // Import the PrismaClient constructor from the @prisma/client package
const prisma = new PrismaClient();   // Create an instance of the PrismaClient, which will be used to interact with the database

module.exports = prisma;    // Export the prisma instance so that it can be imported and used in other parts of the application to perform database operations
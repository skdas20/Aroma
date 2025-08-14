const { PrismaClient } = require('@prisma/client');

// Singleton Prisma client
let prisma;
if (!global.__prisma) {
  global.__prisma = new PrismaClient();
}
prisma = global.__prisma;

async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log(' PostgreSQL connected successfully via Prisma');
  } catch (error) {
    console.error(' PostgreSQL connection error:', error.message);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();
    console.log('🔌 Prisma disconnected through app termination');
  } catch (_) {}
  process.exit(0);
});

// Export prisma client and connector
module.exports = { prisma, connectDatabase };
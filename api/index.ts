import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

// The "Health Check" - Verifies the Brain is alive
fastify.get('/', async () => {
  return { 
    status: "Active", 
    system: "Airybo Core V1",
    protocol: "Capture Interest"
  };
});

// The "Vault Check" - Verifies the Brain can talk to the Database
fastify.get('/db-test', async (request, reply) => {
  try {
    await prisma.$connect();
    return { database: "Connected", message: "Vault is secure." };
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ database: "Disconnected", error: "Check DATABASE_URL" });
  }
});

const start = async () => {
  try {
    // Port 10000 is Render's default, but we use process.env.PORT for flexibility
    const port = Number(process.env.PORT) || 10000;
    
    // CRITICAL FOR RENDER: Must use host '0.0.0.0'
    await fastify.listen({ port, host: '0.0.0.0' });
    
    console.log(` Airybo Brain is listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

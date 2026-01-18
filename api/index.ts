import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const fastify = Fastify({ logger: true })
const prisma = new PrismaClient()

// 1. HEALTH CHECK (The "Pulse")
// Verifies the system is alive without touching the Vault.
fastify.get('/', async (request, reply) => {
  return { 
    status: 'Active', 
    system: 'Airybo Core V1', 
    protocol: 'Capture Interest (CIP)',
    version: 'Phase 1.0'
  }
})

// 2. CAPTURE INTEREST (The "Protocol" - Claim 1)
// Receives a signal, creates an Interest Object, enforces limits.
fastify.post('/interest', async (request, reply) => {
  // Parse the incoming signal (We only need a reference, like an ISBN)
  const { reference, surfaceId = 'default-shortlist', contextType = 'Shortlist' } = request.body as any

  // ENFORCEMENT A: CAPACITY CONSTRAINT (Claim 2)
  // "Bounded interest surface permits a limited number of interest objects"
  const activeCount = await prisma.interestObject.count({
    where: { 
      surfaceId: surfaceId,
      isActive: true 
    }
  })

  // The Hard Limit: 5 Items
  if (activeCount >= 5) {
    return reply.code(429).send({
      error: "Surface Capacity Reached",
      message: "The Bounded Surface is full (5/5). Protocol refuses further capture."
    })
  }

  // ENFORCEMENT B: TEMPORAL CONSTRAINT (Claim 3)
  // "Expiration period measured from creation of the interest object"
  // Logic: Current Time + 12 Hours
  const expirationDate = new Date(Date.now() + (12 * 60 * 60 * 1000))

  // EXECUTION: CREATE INTEREST OBJECT
  try {
    const newInterest = await prisma.interestObject.create({
      data: {
        reference: reference,       // The ISBN/ID
        surfaceId: surfaceId,       // The "Shelf"
        contextType: contextType,
        expiresAt: expirationDate,  // The Self-Destruct Timer
        isActive: true
      }
    })

    // RETURN ACKNOWLEDGMENT (Non-Resolving)
    return {
      status: 'Captured',
      id: newInterest.id,
      expiresAt: newInterest.expiresAt,
      message: 'Interest captured. Resolution deferred.'
    }

  } catch (error) {
    fastify.log.error(error)
    return reply.code(500).send({ error: 'Vault Error', details: 'Could not capture interest.' })
  }
})

// 3. READ SURFACE (View Active Items)
fastify.get('/surface/:surfaceId', async (request, reply) => {
  const { surfaceId } = request.params as any
  
  const items = await prisma.interestObject.findMany({
    where: { surfaceId: surfaceId, isActive: true }
  })
  
  return { surfaceId, count: items.length, items }
})

// START THE BRAIN
const start = async () => {
  try {
    await fastify.listen({ port: 10000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

/**
 * CIP Rule #1: Capture the interest before requiring identity.
 * Purpose: The Brain. Contains the core Capture Logic. 
 */

import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const app = Fastify();
// ... the rest of your code follows

import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const app = Fastify();
const prisma = new PrismaClient();

// The Airybo Capture Endpoint
app.post('/v1/airings', async (request, reply) => {
  const { idempotency_key, raw_payload, source, session_id } = request.body as any;

  try {
    // Doctrine Check: Enforce the 5-Air-Card Shelf Limit
    const activeCount = await prisma.airing.count({
      where: { session_id, res_state: 'unresolved' }
    });

    if (activeCount >= 5) {
      return reply.status(403).send({ 
        code: 'shelf_limit_reached',
        message: 'The Airybo Shelf is limited to 5 active Air Cards.'
      });
    }

    // Capture Intent Protocol: Save verbatim
    const airing = await prisma.airing.create({
      data: { idempotency_key, raw_payload, source, session_id }
    });

    return reply.status(201).send(airing);

  } catch (error: any) {
    // If key exists, return 409 (Standardized Error Contract)
    if (error.code === 'P2002') {
      return reply.status(409).send({ code: 'idempotency_conflict' });
    }
    return reply.status(500).send({ code: 'internal_error' });
  }
});

app.listen({ port: 3000, host: '0.0.0.0' });

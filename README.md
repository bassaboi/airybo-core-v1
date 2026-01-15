The Phase 1 System of Record for Airybo. Implements the Capture Interest Protocol (CIP), managing the 'Air Card' lifecycle and enforcing a 5-item shelf limit for unresolved intents."

# File/Folder,Purpose / Description

/api Folder:  The ""Back-End Fortress."" Contains the server logic, database connection, and API endpoints.

package.json:  The Ingredient List. Defines the technical stack (Node.js, Fastify, Prisma) and the automation scripts for building the API.

index.ts:  The Brain. Contains the core Capture Logic. It receives incoming scans, assigns idempotency keys, and saves them to the database.

prisma/ Folder:  The Blueprint Room. Holds the database schema definitions.

schema.prisma:  The Structural Map. Defines the ""Airing Object"" (ID, timestamp, payload) and ensures the database enforces the unique identity of every scan.

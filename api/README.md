# Airybo Phase 1: Capture Interest Protocol (CIP)

# File Map

* **package.json**: The Ingredient List (Dependencies).
* **index.ts**: CIP Rule #1: Capture the interest before requiring identity 
* **prisma/schema.prisma**: The Blueprint (Database Structure).

/api Folder:	The "Back-End Fortress." Contains the server logic, database connection, and API endpoints.

package.json:	 The Ingredient List. Defines the technical stack (Node.js, Fastify, Prisma) and the automation scripts for building the API.

index.ts:  CIP Rule #1: Capture the interest before requiring identity.         Purpose: The Brain. Contains the core Capture Logic. It receives incoming scans, assigns idempotency keys, and saves them to the database.

prisma/ Folder: 	The Blueprint Room. Holds the database schema definitions.

schema.prisma: 	The Structural Map. Defines the "Airing Object" (ID, timestamp, payload) and ensures the database enforces the unique identity of every scan.

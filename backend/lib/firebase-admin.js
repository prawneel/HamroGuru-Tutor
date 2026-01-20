// Replaced Firebase Admin with Prisma-based DB access
// This file provides a `prisma` export compatible with previous DB usage sites.
require('dotenv').config();

// If DATABASE_URL is not set, export a stubbed prisma that throws a clear error
// when its methods are called. Avoid requiring '@prisma/client' at module
// load time so Prisma doesn't attempt to validate environment variables
// during development when Postgres is not configured.
if (!process.env.DATABASE_URL) {
	const makeMissingDbError = () => new Error('Missing DATABASE_URL. Copy backend/.env.sample to backend/.env and set DATABASE_URL to a valid Postgres connection string.');

	const prismaStub = {
		user: {
			upsert: async () => { throw makeMissingDbError(); },
			findUnique: async () => { throw makeMissingDbError(); }
		},
		teacherProfile: {
			findMany: async () => { throw makeMissingDbError(); },
			findUnique: async () => { throw makeMissingDbError(); },
			upsert: async () => { throw makeMissingDbError(); },
			update: async () => { throw makeMissingDbError(); }
		},
		$transaction: async () => { throw makeMissingDbError(); },
		$disconnect: async () => {},
	};

	const adminAuth = null;
	const adminDb = null;
	const adminStorage = null;

	module.exports = { prisma: prismaStub, adminAuth, adminDb, adminStorage };
} else {
	const { PrismaClient } = require('@prisma/client');
	const prisma = new PrismaClient();
	const adminAuth = null;
	const adminDb = null;
	const adminStorage = null;
	module.exports = { prisma, adminAuth, adminDb, adminStorage };
}

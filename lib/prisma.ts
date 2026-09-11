import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Parse the DATABASE_URL connection string dynamically
const dbUrl = process.env.DATABASE_URL || 'mysql://root:maaz@localhost:3306/abbasshoping';
let urlParsed: URL;
try {
  urlParsed = new URL(dbUrl);
} catch {
  // Fallback in case of invalid URL structure
  urlParsed = new URL('mysql://root:maaz@localhost:3306/abbasshoping');
}

const adapter = new PrismaMariaDb({
  host: urlParsed.hostname || 'localhost',
  port: urlParsed.port ? Number(urlParsed.port) : 3306,
  user: urlParsed.username || 'root',
  password: urlParsed.password ? decodeURIComponent(urlParsed.password) : '',
  database: urlParsed.pathname.replace(/^\//, '') || 'abbasshoping',
  connectionLimit: 10,
});

function createClient(): PrismaClient {
  return new PrismaClient({ adapter });
}

// Auto-refresh client if schema models were updated
if (!globalForPrisma.prisma || !(globalForPrisma.prisma as any).bundle) {
  globalForPrisma.prisma = createClient();
}

export const prisma = globalForPrisma.prisma;
export default prisma;
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const isDatabaseConfigured = Boolean(
  process.env.SQL_HOST && process.env.SQL_DB_NAME
);

export const createPool = (): Pool | null => {
  if (!isDatabaseConfigured) {
    return null;
  }
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

let db: NodePgDatabase<typeof schema>;
try {
  const pool = createPool();
  if (!pool) {
    throw new Error('Database environment variables not configured');
  }
  db = drizzle(pool, { schema });
} catch {
  console.warn('[AI Studio] Database not connected — using in-memory fallback');
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
  };
  db = new Proxy({} as NodePgDatabase<typeof schema>, {
    get: (_, prop) =>
      prop === 'query' ? new Proxy({}, { get: () => noOp }) : async () => [],
  });
}

export { db };


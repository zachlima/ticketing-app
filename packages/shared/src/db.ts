import pg from 'pg';
import { config } from './config.js';

let pool: pg.Pool | undefined;

/** Lazily-created shared connection pool. Azure Postgres requires TLS. */
export function getPool(): pg.Pool {
  pool ??= new pg.Pool({
    connectionString: config.postgresConnectionString(),
    ssl: { rejectUnauthorized: true },
  });
  return pool;
}

export async function query<T extends pg.QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<pg.QueryResult<T>> {
  return getPool().query<T>(text, params);
}

export async function closePool(): Promise<void> {
  await pool?.end();
  pool = undefined;
}

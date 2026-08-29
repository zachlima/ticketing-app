/**
 * Backend API — ticket CRUD over Postgres, behind Entra ID token validation.
 *
 * Scaffold only: /health is real, everything else is still to be built.
 * See docs/design.md §1 and §4.
 */
import express from 'express';
import { query } from '@ticketing/shared';

const PORT = Number(process.env.PORT ?? 3001);

const app = express();
app.use(express.json());

// TODO: Entra ID bearer-token validation middleware (validate against the
// frontend app registration; any authenticated user may see all tickets).

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

/** Verifies the API can actually reach Postgres. */
app.get('/health/db', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', database: 'reachable' });
  } catch (error) {
    console.error('[api] database health check failed:', error);
    res.status(503).json({ status: 'error', database: 'unreachable' });
  }
});

// TODO: GET    /api/tickets            list + filters
// TODO: GET    /api/tickets/:id        header + replies
// TODO: PATCH  /api/tickets/:id        assign agent, set type, close
// TODO: GET    /api/dashboard          open / unassigned / assigned-to-me counts
// TODO: GET    /api/agents             agent list for the assignment dropdown

app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
});

/**
 * Email service — polls the shared mailbox via Microsoft Graph and turns
 * messages into ticket rows.
 *
 * The poll loop and shutdown handling are wired up.
 * `pollOnce` acquires a Graph token. See docs/design.md §1.
 */
import { closePool } from '@ticketing/shared';
import { getAccessToken } from './graph.js'

const POLL_INTERVAL_MS = 60_000;

async function pollOnce(): Promise<void> {
  // acquire a Graph token (client credentials), list messages in the
  // shared mailbox received since the last run, and for each message:
  //   - skip if graph_message_id already exists (dedupe)
  //   - match conversation_id against ticket_header
  //   - no match  -> insert ticket_header (status 'new', unassigned)
  //   - match     -> insert ticket_reply, then set parent status to
  //                  'waiting_response' if sender is a known agent,
  //                  otherwise 'in_progress'
  const token = await getAccessToken();
  console.log(token.slice(0, 10));
}

async function main(): Promise<void> {
  console.log(
    `[email-service] starting, polling every ${POLL_INTERVAL_MS / 1000}s`,
  );

  let stopping = false;
  const shutdown = async (signal: string): Promise<void> => {
    if (stopping) return;
    stopping = true;
    console.log(`[email-service] ${signal} received, shutting down`);
    await closePool();
    process.exit(0);
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));

  while (!stopping) {
    try {
      await pollOnce();
    } catch (error) {
      // Keep polling — a transient Graph or DB failure should not kill the loop.
      console.error('[email-service] poll failed:', error);
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

void main();

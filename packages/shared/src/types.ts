/** Mirrors the `ticket_status` enum in db/migrations/001_init.sql. */
export const TICKET_STATUSES = [
  'new',
  'waiting_response',
  'in_progress',
  'closed',
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface Agent {
  id: string;
  name: string;
  email: string;
}

export interface TicketHeader {
  id: string;
  subject: string | null;
  sender: string;
  recipients: string | null;
  conversation_id: string;
  graph_message_id: string | null;
  /** null = unassigned. Assignment is manual; the email pipeline never sets it. */
  agent_id: string | null;
  status: TicketStatus;
  /** null until an agent triages the ticket. */
  type: string | null;
  body: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface TicketReply {
  id: string;
  parent_ticket_id: string;
  subject: string | null;
  sender: string;
  recipients: string | null;
  graph_message_id: string | null;
  body: string | null;
  received_at: Date;
}

export interface DashboardCounts {
  /** status <> 'closed' */
  open: number;
  /** agent_id IS NULL */
  unassigned: number;
  /** agent_id = the logged-in agent */
  assignedToMe: number;
}

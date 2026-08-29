-- Initial schema. Mirrors docs/design.md §9.
-- Already applied to the Azure flexible server; kept here so the schema is
-- reproducible and version-controlled rather than living only in the doc.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE ticket_status AS ENUM ('new', 'waiting_response', 'in_progress', 'closed');

CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE ticket_header (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT,
  sender TEXT NOT NULL,
  recipients TEXT,
  conversation_id TEXT NOT NULL UNIQUE,
  graph_message_id TEXT UNIQUE,
  agent_id UUID REFERENCES agents(id),
  status ticket_status NOT NULL DEFAULT 'new',
  type TEXT,
  body TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ticket_reply (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_ticket_id UUID NOT NULL REFERENCES ticket_header(id),
  subject TEXT,
  sender TEXT NOT NULL,
  recipients TEXT,
  graph_message_id TEXT UNIQUE,
  body TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- conversation_id's UNIQUE constraint already creates its own index.

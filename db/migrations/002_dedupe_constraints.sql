-- Close the deduplication gap
-- 1. graph_message_id was nullable but Postgres allows unlimited
-- NULLSs, so duplicates could occur
-- 2. ticket_header and ticket_reply had separate UNIQUE indexes so
-- the same message could exist in each and neither constraint would
-- notice

BEGIN;

CREATE TABLE processed_message (
    graph_message_id TEXT PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ticket_header
    ALTER COLUMN graph_message_id SET NOT NULL;

ALTER TABLE ticket_header
    ADD CONSTRAINT ticket_header_graph_message_id_fkey
        FOREIGN KEY (graph_message_id) REFERENCES processed_message(graph_message_id);

ALTER TABLE ticket_reply
    ALTER COLUMN graph_message_id SET NOT NULL;

ALTER TABLE ticket_reply
    ADD CONSTRAINT ticket_reply_graph_message_id_fkey
        FOREIGN KEY (graph_message_id) REFERENCES processed_message(graph_message_id);

COMMIT;
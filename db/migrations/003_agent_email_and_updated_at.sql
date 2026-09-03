-- 003 — Case-insensitive agent email, and make updated_at actually update.
--
-- 1. agents.email had a plain UNIQUE constraint, which is case-sensitive.
--    The design requires matching senders case-insensitively, so
--    Zach@x.com and zach@x.com were two different agents and a reply from
--    one would not match the other. A unique index on lower(email) enforces
--    the rule and makes lower(email) = lower($1) lookups fast.
--
-- 2. updated_at had DEFAULT now(), which only fires on INSERT. Updating a
--    ticket's status left updated_at at its original value, silently. A
--    BEFORE UPDATE trigger fixes it so no query can forget.
--    ticket_reply needs no trigger — replies are immutable once ingested.

BEGIN;

CREATE UNIQUE INDEX agents_email_lower_idx ON agents (lower(email));

ALTER TABLE agents DROP CONSTRAINT agents_email_key;

CREATE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ticket_header_set_updated_at
    BEFORE UPDATE ON ticket_header
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMIT;
# Ticketing App

Helpdesk ticketing app replacing a Power Apps / Dataverse setup. Email-to-ticket
via Microsoft Graph, Postgres as the source of truth, React + Entra ID frontend.

## Layout

npm workspaces monorepo — the email service and API deploy as separate processes.

| Package | What it is |
|---|---|
| `packages/shared` | Ticket types, env config, Postgres pool — used by both services |
| `packages/email-service` | Polls the shared mailbox via Graph, writes ticket rows |
| `packages/api` | Ticket CRUD REST API, behind Entra ID token validation |
| `packages/web` | React + Vite frontend |
| `db/migrations` | Schema DDL |

## Setup

```bash
npm install
npm run build --workspace @ticketing/shared
```

`packages/shared` must be built before the services typecheck against it.

Config comes from a repo-root `.env` (gitignored); the dev/start scripts pass it
in with `--env-file`. Required keys: `TENANT_ID`, `FRONTEND_CLIENT_ID`,
`EMAIL_SERVICE_CLIENT_ID`, `EMAIL_SERVICE_CLIENT_SECRET`,
`POSTGRES_CONNECTION_STRING`, `SHARED_MAILBOX`.

## Running

```bash
npm run dev:api
```

```bash
npm run dev:email
```

```bash
npm run dev:web
```

Check the API is up and can reach Postgres:

```bash
curl localhost:3001/health/db
```

## Status

Scaffold. `/health` works; ticket endpoints, the Graph poll loop, and the
frontend UI are all still to be built.

/**
 * Reads config from the environment. Run processes with `--env-file=../../.env`
 * (see each package's dev script) so these are populated.
 *
 * Note: in Azure the email service is meant to read its client secret from Key
 * Vault via managed identity, not from an env var. EMAIL_SERVICE_CLIENT_SECRET
 * is a local-development convenience only.
 */

function required(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === '') {
    throw new Error(
      `Missing required environment variable ${name}. ` +
        `Is the process running with --env-file pointed at the repo-root .env?`,
    );
  }
  return value.trim();
}

function optional(name: string): string | undefined {
  const value = process.env[name];
  return value === undefined || value.trim() === '' ? undefined : value.trim();
}

export const config = {
  tenantId: () => required('TENANT_ID'),
  frontendClientId: () => required('FRONTEND_CLIENT_ID'),
  emailServiceClientId: () => required('EMAIL_SERVICE_CLIENT_ID'),
  emailServiceClientSecret: () => required('EMAIL_SERVICE_CLIENT_SECRET'),
  /** Key Vault URI the secret should be resolved from once deployed. */
  emailServiceClientSecretKeyVaultUri: () =>
    optional('EMAIL_SERVICE_CLIENT_SECRET_KV_URI'),
  postgresConnectionString: () => required('POSTGRES_CONNECTION_STRING'),
  /** Shared mailbox the email service polls. */
  sharedMailbox: () => required('SHARED_MAILBOX'),
} as const;

import { ClientSecretCredential } from '@azure/identity'
import { config } from '@ticketing/shared'

let credential: ClientSecretCredential | undefined;

export async function getAccessToken(): Promise<string> {
    const tenantId = config.tenantId();
    const clientId = config.emailServiceClientId();
    const clientSecret = config.emailServiceClientSecret();
    credential ??= new ClientSecretCredential(tenantId, clientId, clientSecret);
    const accessToken = await credential.getToken('https://graph.microsoft.com/.default');
    if (accessToken === null) {
        throw new Error('Token not found');
    }
    return accessToken.token;
}

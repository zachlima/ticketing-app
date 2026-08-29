import { ClientSecretCredential } from '@azure/identity'
import { config } from '@ticketing/shared'

export default async function Graph(): Promise<string> {
    const tenantId = config.tenantId();
    const clientId = config.emailServiceClientId();
    const clientSecret = config.emailServiceClientSecret();
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const accessToken = await credential.getToken('https://graph.microsoft.com/.default');
    if (accessToken === null) {
        throw new Error('Token not found');
    } else {
        return accessToken.token;
    }
}

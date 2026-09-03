import { ClientSecretCredential } from '@azure/identity'
import { config } from '@ticketing/shared'

export interface GraphMessage {
    id: string;
    conversationId: string;
    subject: string | null;
    receivedDateTime: string;
    from: { emailAddress: { address: string; name?: string }} | null;
}

interface MessageListResponse {
    value: GraphMessage[];
}

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

export async function listMessages(): Promise<GraphMessage[]> {
    const token = await getAccessToken();
    const mailbox = encodeURIComponent(config.sharedMailbox());
    const url =
        `https://graph.microsoft.com/v1.0/users/${mailbox}/messages?$top=10&$select=id,conversationId,subject,receivedDateTime,from`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            Prefer: 'IdType="ImmutableId"',
        },
    });

    if (!response.ok) {
        throw new Error(
            `Graph ${response.status} ${response.statusText}: ${await response.text()}`
        );
    }

    const body = (await response.json()) as MessageListResponse;
    return body.value;
}
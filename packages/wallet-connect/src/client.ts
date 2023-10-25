import { SignClient } from '@walletconnect/sign-client';
import type {
    ResolvedSignClient,
    WalletConnectOptions,
    WCClient,
} from './types';

const _cachedClients: Record<string, WCClient | undefined> = {};

export const newWcClient = ({
    projectId,
    metadata,
}: WalletConnectOptions): WCClient => {
    const cachedClient = _cachedClients[projectId];

    if (cachedClient) {
        return cachedClient;
    }

    const _signClient = SignClient.init({
        projectId,
        metadata,
    });

    const client: WCClient = {
        get: async (): Promise<ResolvedSignClient> => {
            try {
                return await _signClient;
            } catch (e) {
                throw new Error(
                    `Failed to initialise the wallet connect sign client`,
                );
            }
        },
    };

    _cachedClients[projectId] = client;

    return client;
};

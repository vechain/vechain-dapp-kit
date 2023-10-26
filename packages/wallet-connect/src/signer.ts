/// <reference types="@vechain/connex-types" />
import type { SessionTypes } from '@walletconnect/types';
import type { ProposalTypes } from '@walletconnect/types/dist/types/sign-client/proposal';
import type { EngineTypes } from '@walletconnect/types/dist/types/sign-client/engine';
import { getSdkError } from '@walletconnect/utils';
import type { SignClient } from '@walletconnect/sign-client/dist/types/client';
import type { WCSigner, WCSignerOptions } from './types';
import { DefaultMethods } from './constants';

interface SessionAccount {
    networkIdentifier: string;
    address: string;
    topic: string;
}

export const newWcSigner = ({
    genesisId,
    wcClient,
    web3Modal,
    onDisconnected,
}: WCSignerOptions): WCSigner => {
    const chainId = `vechain:${genesisId.slice(-32)}`;
    let session: SessionTypes.Struct | undefined;

    wcClient
        .get()
        .then((clientInstance) => {
            listenToEvents(clientInstance);
            restoreSession(clientInstance);
        })
        .catch(() => {
            throw new Error(
                `Failed to initialise the wallet connect sign client`,
            );
        });

    const makeRequest = async <T>(
        params: EngineTypes.RequestParams['request'],
        signer?: string,
    ): Promise<T> => {
        const sessionTopic = await getSessionTopic(signer);

        const signClient = await wcClient.get();

        return signClient.request({
            topic: sessionTopic,
            chainId,
            request: params,
        });
    };

    const signTx = async (
        message: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> => {
        return makeRequest<Connex.Vendor.TxResponse>({
            method: DefaultMethods.RequestTransaction,
            params: [{ message, options }],
        });
    };

    const signCert = async (
        message: Connex.Vendor.CertMessage,
        options: Connex.Signer.CertOptions,
    ): Promise<Connex.Vendor.CertResponse> => {
        return makeRequest<Connex.Vendor.CertResponse>({
            method: DefaultMethods.SignCertificate,
            params: [{ message, options }],
        });
    };

    const disconnect = async (): Promise<void> => {
        if (!session) return;

        const topic = session.topic;
        session = undefined;

        const signClient = await wcClient.get();

        try {
            await signClient.disconnect({
                topic,
                reason: getSdkError('USER_DISCONNECTED'),
            });
        } catch (e) {
            throw new Error(`SignClient.disconnect failed`);
        }
    };

    /**
     * Validates the requested account and network against a request
     * @param requestedAddress - The optional requested account address
     */
    const validateSession = (
        requestedAddress?: string,
    ): SessionAccount | undefined => {
        if (!session) return;

        const firstAccount = session.namespaces.vechain.accounts[0];

        const address = firstAccount.split(':')[2];
        const networkIdentifier = firstAccount.split(':')[1];

        // Return undefined if the network identifier doesn't match
        if (networkIdentifier !== genesisId.slice(-32)) return;

        // Return undefined if the address doesn't match
        if (
            requestedAddress &&
            requestedAddress.toLowerCase() !== address.toLowerCase()
        )
            return;

        return {
            address,
            networkIdentifier,
            topic: session.topic,
        };
    };

    const getSessionTopic = async (
        requestedAccount?: string,
    ): Promise<string> => {
        const validation = validateSession(requestedAccount);

        if (validation) return validation.topic;

        const newSession = await connect();

        return newSession.topic;
    };

    const connect = async (): Promise<SessionTypes.Struct> => {
        const signClient = await wcClient.get();

        const namespace: ProposalTypes.RequiredNamespace = {
            methods: Object.values(DefaultMethods),
            chains: [chainId],
            events: [],
        };

        try {
            const requiredNamespaces: Record<
                string,
                ProposalTypes.RequiredNamespace
            > = {
                vechain: namespace,
            };

            const { uri, approval } = await signClient.connect({
                requiredNamespaces,
            });

            if (uri) {
                await web3Modal.openModal({ uri, chains: namespace.chains });
            }

            return await new Promise((resolve, reject) => {
                web3Modal.subscribeModal((ev: { open: boolean }) => {
                    if (!ev.open) {
                        reject(new Error('User closed modal'));
                    }
                });

                approval()
                    .then((newSession) => {
                        session = newSession;
                        resolve(newSession);
                    })
                    .catch(reject);
            });
        } finally {
            web3Modal.closeModal();
        }
    };

    const listenToEvents = (_client: SignClient): void => {
        _client.on('session_update', ({ topic, params }) => {
            const { namespaces } = params;
            const _session = _client.session.get(topic);
            session = { ..._session, namespaces };
        });

        _client.on('session_delete', () => {
            if (onDisconnected) onDisconnected();
            disconnect().catch(() => {
                throw new Error('Failed to disconnect');
            });
        });
    };

    const restoreSession = (_client: SignClient): void => {
        if (typeof session !== 'undefined') return;

        const sessionKeys = _client.session.keys;

        for (const key of sessionKeys) {
            const _session = _client.session.get(key);
            const accounts = _session.namespaces.vechain.accounts;

            for (const acc of accounts) {
                if (acc.split(':')[1] === genesisId.slice(-32)) {
                    session = _session;
                    return;
                }
            }
        }
    };

    return {
        signTx,
        signCert,
        disconnect,
        genesisId,
    };
};

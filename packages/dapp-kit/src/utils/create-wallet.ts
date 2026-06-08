import { ThorClient } from '@vechain/sdk-network';
import { CertificateBasedWallet } from '../classes';
import type {
    DAppKitOptions,
    VeChainWallet,
    WalletSource,
    WCClient,
    WCModal,
} from '../types';
import { createSync, createSync2 } from './create-sync2';
import { createVeWorldV2Wallet } from './create-veworld-v2-wallet';
import { createWcClient } from './create-wc-client';
import { createWcModal } from './create-wc-modal';
import { createWcSigner } from './create-wc-signer';
import { DAppKitLogger } from './logger';

type ICreateWallet = DAppKitOptions & {
    source: WalletSource;
    onDisconnected: () => void;
    thor: ThorClient;
};

export const createWallet = async ({
    source,
    thor,
    walletConnectOptions,
    onDisconnected,
    connectionCertificate,
    v2Api,
}: ICreateWallet): Promise<VeChainWallet> => {
    DAppKitLogger.debug('createWallet', source);

    const genesisId = await thor.blocks
        .getGenesisBlock()
        .then((block) => block?.id);
    if (!genesisId) throw new Error('Failed to get genesis block');

    switch (source) {
        case 'sync': {
            if (!window.connex) {
                throw new Error('Connex is not available');
            }

            const signer = createSync();
            return new CertificateBasedWallet(
                signer,
                null,
                genesisId,
                connectionCertificate,
            );
        }
        case 'sync2': {
            const signer = createSync2(genesisId);
            return new CertificateBasedWallet(
                signer,
                null,
                genesisId,
                connectionCertificate,
            );
        }
        case 'veworld': {
            try {
                if (!window.vechain) {
                    throw new Error('VeWorld Extension is not installed');
                }

                // Prefer the v2 EIP-1193-style `request` API only when the app
                // explicitly enables v2. Otherwise keep the legacy
                // certificate-based connection flow.
                const ext = window.vechain as unknown as {
                    request?: (args: {
                        method: string;
                        params?: unknown;
                    }) => Promise<unknown>;
                };
                if (
                    v2Api?.enabled !== false &&
                    typeof ext.request === 'function'
                ) {
                    const { walletSigner, walletProvider } =
                        createVeWorldV2Wallet(ext.request.bind(ext), genesisId);
                    return new CertificateBasedWallet(
                        walletSigner,
                        walletProvider,
                        genesisId,
                        connectionCertificate,
                    );
                }

                // Legacy fallback for hosts that only expose the Connex-style
                // surface (`newConnexSigner` + optional `send`). Currently this
                // is veworld-mobile's in-app browser, which injects
                // `window.vechain` without an EIP-1193 `request` method. The
                // legacy path is also kept for older VeWorld extension builds
                // that haven't shipped the v2 API yet.
                if (typeof window.vechain.newConnexSigner === 'function') {
                    const veworld = window.vechain.newConnexSigner(genesisId);
                    return new CertificateBasedWallet(
                        veworld,
                        'send' in window.vechain
                            ? { send: window.vechain.send }
                            : null,
                        genesisId,
                        connectionCertificate,
                    );
                }

                throw new Error('VeWorld v2 API is not available');
            } catch (e) {
                DAppKitLogger.error('createWallet', 'veworld', e);
                throw e;
            }
        }
        case 'wallet-connect': {
            if (!walletConnectOptions) {
                throw new Error('WalletConnect options are not provided');
            }

            const { projectId, metadata, modal } = walletConnectOptions;

            const wcClient: WCClient = createWcClient({
                projectId,
                metadata,
            });

            const web3Modal: WCModal = modal ?? createWcModal(projectId);

            return createWcSigner({
                genesisId,
                wcClient,
                web3Modal,
                onDisconnected,
            });
        }
    }
};

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
                const veworld = window.vechain.newConnexSigner(genesisId);
                return new CertificateBasedWallet(
                    veworld,
                    'send' in window.vechain
                        ? { send: window.vechain.send }
                        : null,
                    genesisId,
                    connectionCertificate,
                );
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

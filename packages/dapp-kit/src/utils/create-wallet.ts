import type { ThorClient } from '@vechain/sdk-network';
import type {
    DAppKitOptions,
    VechainWallet,
    WalletSource,
    WCClient,
    WCModal,
} from '../types';
import { CertificateBasedWallet } from '../classes/certificate-wallet';
import type { WalletSigner } from '../types/types';
import { createWcClient } from './create-wc-client';
import { createWcModal } from './create-wc-modal';
import { createWcSigner } from './create-wc-signer';
import { DAppKitLogger } from './logger';
import { createSync, createSync2 } from './create-sync2';

type ICreateWallet = DAppKitOptions & {
    source: WalletSource;
    onDisconnected: () => void;
    thor: ThorClient;
};

export const createWallet = ({
    source,
    thor,
    walletConnectOptions,
    onDisconnected,
    connectionCertificate,
}: ICreateWallet): VechainWallet => {
    DAppKitLogger.debug('createWallet', source);

    const genesisId = thor.blocks.getGenesisBlock().then((block) => {
        if (!block) {
            throw new Error('Failed to get genesis block');
        }
        return block.id;
    });

    switch (source) {
        case 'sync': {
            if (!window.connex) {
                throw new Error('Connex is not available');
            }

            const signer = createSync(genesisId);
            return new CertificateBasedWallet(signer, connectionCertificate);
        }
        case 'sync2': {
            const signer = createSync2(genesisId);
            return new CertificateBasedWallet(signer, connectionCertificate);
        }
        case 'veworld': {
            if (!window.vechain) {
                throw new Error('VeWorld Extension is not installed');
            }

            const signer: Promise<WalletSigner> = genesisId
                .then((genesis) => {
                    if (!window.vechain) {
                        throw new Error('VeWorld Extension is not installed');
                    }

                    return window.vechain.newConnexSigner(genesis);
                })
                .catch((e) => {
                    DAppKitLogger.error('createWallet', 'veworld', e);
                    throw e;
                });

            return new CertificateBasedWallet(signer, connectionCertificate);
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

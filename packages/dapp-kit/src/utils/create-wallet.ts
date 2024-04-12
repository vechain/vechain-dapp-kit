import type {
    DAppKitOptions,
    RemoteWallet,
    WalletSource,
    WCClient,
    WCModal,
} from '../types';
import { CertificateBasedWallet } from '../classes/certificate-wallet';
import { WCWallet } from '../classes/wc-wallet';
import { createWcClient } from './create-wc-client';
import { createWcModal } from './create-wc-modal';
import { createWcSigner } from './create-wc-signer';
import { normalizeGenesisId } from './genesis';
import { DAppKitLogger } from './logger';
import { createSync, createSync2 } from './sync-signers';

type ICreateWallet = DAppKitOptions & {
    source: WalletSource;
    onDisconnected: () => void;
};

export const createWallet = ({
    source,
    genesis,
    walletConnectOptions,
    onDisconnected,
    connectionCertificate,
}: ICreateWallet): RemoteWallet => {
    const genesisId = normalizeGenesisId(genesis);

    DAppKitLogger.debug('createWallet', source);

    switch (source) {
        case 'sync': {
            if (!window.connex) {
                throw new Error('User is not in a Sync wallet');
            }

            const vendor = createSync(genesisId);

            return new CertificateBasedWallet(vendor, connectionCertificate);
        }
        case 'sync2': {
            const vendor = createSync2(genesisId);

            return new CertificateBasedWallet(vendor, connectionCertificate);
        }
        case 'veworld': {
            if (!window.vechain) {
                throw new Error('VeWorld Extension is not installed');
            }

            const signer = window.vechain.newConnexSigner(genesisId);

            return new CertificateBasedWallet(
                Promise.resolve(signer),
                connectionCertificate,
            );
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

            const wallet = createWcSigner({
                genesisId,
                wcClient,
                web3Modal,
                onDisconnected,
            });

            return new WCWallet(wallet);
        }
    }
};

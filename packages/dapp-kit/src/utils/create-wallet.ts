import { Connex } from '@vechain/connex';
import type {
    ConnexWallet,
    DAppKitOptions,
    WalletSource,
    WCClient,
    WCModal,
} from '../types';
import { CertificateBasedWallet } from '../classes/certificate-wallet';
import { WCWallet } from '../classes/wc-wallet';
import { createWcClient } from './create-wc-client';
import { createWcModal } from './create-wc-modal';
import { createWcSigner } from './create-wc-signer';
import { convertVendorToSigner } from './convert-vendor-to-signer';
import { normalizeGenesisId } from './genesis';
import { DAppKitLogger } from './logger';

type ICreateWallet = DAppKitOptions & {
    source: WalletSource;
    onDisconnected: () => void;
};

export const createWallet = ({
    source,
    genesis,
    walletConnectOptions,
    onDisconnected,
}: ICreateWallet): ConnexWallet => {
    const genesisId = normalizeGenesisId(genesis);

    DAppKitLogger.debug('createWallet', source);

    switch (source) {
        case 'sync': {
            if (!window.connex) {
                throw new Error('User is not in a Sync wallet');
            }

            const vendor = new Connex.Vendor(genesisId, 'sync');

            return new CertificateBasedWallet(convertVendorToSigner(vendor));
        }
        case 'sync2': {
            const vendor = new Connex.Vendor(genesisId, 'sync2');

            return new CertificateBasedWallet(convertVendorToSigner(vendor));
        }
        case 'veworld': {
            if (!window.vechain) {
                throw new Error('VeWorld Extension is not installed');
            }

            const signer = window.vechain.newConnexSigner(genesisId);

            return new CertificateBasedWallet(signer);
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

import { Connex } from '@vechain/connex';
import type { WCClient, WCModal } from './wallet-connect';
import { createWcClient, createWcModal, newWcSigner } from './wallet-connect';
import type { ConnexWallet, DAppKitOptions, WalletSource } from './types';
import { CertificateBasedWallet } from './wallets/certificate-wallet';
import { WCWallet } from './wallets/wc-wallet';
import { normalizeGenesisId } from './genesis';
import { convertVendorToSigner } from './vendor-signer';
import { DAppKitLogger } from './utils';

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

            const wallet = newWcSigner({
                genesisId,
                wcClient,
                web3Modal,
                onDisconnected,
            });

            return new WCWallet(wallet);
        }
    }
};

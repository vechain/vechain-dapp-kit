import {
    newWcClient,
    newWcSigner,
    newWeb3Modal,
} from '@vechainfoundation/wallet-connect/dist';
import { createSync, createSync2 } from '@vechain/connex/esm/signer';
import type { ConnexOptions, ConnexWallet, WalletSource } from './types';
import { CertificateBasedWallet } from './wallets/certificate-wallet';
import { WCWallet } from './wallets/wc-wallet';
import { normalizeGenesisId } from './genesis';

type ICreateWallet = ConnexOptions & {
    source: WalletSource;
    onDisconnected: () => void;
};

export const createWallet = ({
    source,
    genesis,
    walletConnectOptions,
    onDisconnected,
    customWcModal,
}: ICreateWallet): ConnexWallet => {
    const genesisId = normalizeGenesisId(genesis);

    switch (source) {
        case 'sync': {
            if (!window.connex) {
                throw new Error('User is not in a Sync wallet');
            }

            const signer = createSync(genesisId);

            return new CertificateBasedWallet(signer);
        }
        case 'sync2': {
            const signer = createSync2(genesisId);

            return new CertificateBasedWallet(signer);
        }
        case 'veworld-extension': {
            if (!window.vechain) {
                throw new Error('VeWorld Extension is not installed');
            }

            const signer = window.vechain.newConnexSigner(genesisId);

            return new CertificateBasedWallet(Promise.resolve(signer));
        }
        case 'wallet-connect': {
            if (!walletConnectOptions) {
                throw new Error('WalletConnect options are not provided');
            }

            const { projectId, metadata } = walletConnectOptions;

            const wcClient = newWcClient({
                projectId,
                metadata,
            });

            const web3Modal = customWcModal ?? newWeb3Modal(projectId);

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

import {
    newWcClient,
    newWcSigner,
    newWeb3Modal,
} from '@vechain/wallet-connect/dist';
import { createSync, createSync2 } from '@vechain/connex/esm/signer';
import type { ConnexOptions, ConnexWallet } from './types';
import { normalizeGenesisId } from './genesis';
import { CertificateConnectionWallet } from './wallets/certificate-connection';
import { WcConnectionWallet } from './wallets/wc-connection';

export const createWallet = (
    params: ConnexOptions,
): ConnexWallet | undefined => {
    const { source, genesis } = params;

    if (!source) {
        return;
    }

    const genesisId = normalizeGenesisId(genesis);

    switch (source) {
        case 'sync': {
            if (!window.connex) {
                throw new Error('User is not in a Sync wallet');
            }

            const signer = createSync(genesisId);

            return new CertificateConnectionWallet(signer);
        }
        case 'sync2': {
            const signer = createSync2(genesisId);

            return new CertificateConnectionWallet(signer);
        }
        case 'veworld-extension': {
            if (!window.vechain) {
                throw new Error('VeWorld Extension is not installed');
            }

            const signer = window.vechain.newConnexSigner(genesisId);

            return new CertificateConnectionWallet(Promise.resolve(signer));
        }
        case 'wallet-connect': {
            const { walletConnectOptions, onDisconnected } = params;

            if (!walletConnectOptions) {
                onDisconnected();
                return;
            }

            const { projectId, metadata } = walletConnectOptions;

            const wcClient = newWcClient({
                projectId,
                metadata,
            });

            const web3Modal = newWeb3Modal(projectId);

            const wallet = newWcSigner({
                genesisId,
                wcClient,
                web3Modal,
                onDisconnected,
            });

            return new WcConnectionWallet(wallet);
        }
    }
};

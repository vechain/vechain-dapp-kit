import type { WCSigner } from '@vechain/wallet-connect/dist';
import {
    newWcClient,
    newWcSigner,
    newWeb3Modal,
} from '@vechain/wallet-connect/dist';
import { createSync, createSync2 } from '@vechain/connex/esm/signer';
import { WalletSource } from './wallet';
import type { ConnexOptions, ConnexSigner } from './types';
import { normalizeGenesisId } from './genesis';

export const createSigner = (
    params: ConnexOptions,
): Promise<ConnexSigner> | undefined => {
    const { source, genesis } = params;

    if (!source) {
        return;
    }

    const genesisId = normalizeGenesisId(genesis);

    switch (source) {
        case WalletSource.Sync: {
            if (!window.connex) {
                throw new Error('User is not in a Sync wallet');
            }

            return createSync(genesisId);
        }
        case WalletSource.Sync2: {
            return createSync2(genesisId);
        }
        case WalletSource.VeWorldExtension: {
            if (!window.vechain) {
                throw new Error('VeWorld Extension is not installed');
            }

            const signer = window.vechain.newConnexSigner(genesisId);

            return Promise.resolve(signer);
        }
        case WalletSource.WalletConnect: {
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

            const wcSigner: WCSigner = newWcSigner({
                genesisId,
                wcClient,
                web3Modal,
                onDisconnected,
            });

            return Promise.resolve(wcSigner);
        }
    }
};

import type {
    WalletConnectOptions,
    WCSigner
} from '@vechain/wallet-connect/dist';
import {
    newWcClient,
    newWcSigner,
    newWeb3Modal
} from '@vechain/wallet-connect/dist';
import type { Connex } from '@vechain/connex';
import { createSync, createSync2 } from '@vechain/connex/esm/signer';
import { WalletSource } from './wallet';
import type { Genesis } from './types';
import { normalizeGenesisId } from './genesis';

interface WCOptions {
    source: WalletSource.WalletConnect;
    genesis: Genesis;
    options: WalletConnectOptions;
    onDisconnected: () => void;
}

interface DefaultOptions {
    source:
        | WalletSource.Sync
        | WalletSource.Sync2
        | WalletSource.VeWorldExtension;
    genesis: Genesis;
}

type ICreateVendor = DefaultOptions | WCOptions;

export const createSigner = (params: ICreateVendor): Promise<Connex.Signer> => {
    const { source, genesis } = params;

    const genesisId = normalizeGenesisId(genesis);

    if (source === WalletSource.VeWorldExtension) {
        if (!window.vechain) {
            throw new Error('VeWorld Extension is not installed');
        }

        const signer = window.vechain.newConnexSigner(genesisId);

        return Promise.resolve(signer);
    }

    if (source === WalletSource.WalletConnect) {
        const { onDisconnected, options } = params;

        const { projectId, metadata } = options;

        const wcClient = newWcClient({
            projectId,
            metadata
        });

        const web3Modal = newWeb3Modal(projectId);

        const wcSigner: WCSigner = newWcSigner({
            genesisId,
            wcClient,
            web3Modal,
            onDisconnected
        });

        return Promise.resolve(wcSigner);
    }

    if (source === WalletSource.Sync) {
        if (!window.connex) {
            throw new Error('User is not in a Sync wallet');
        }

        return createSync(genesisId);
    }

    return createSync2(genesisId);
};

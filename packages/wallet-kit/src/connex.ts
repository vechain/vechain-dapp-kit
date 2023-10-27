import { createNoVendor } from '@vechain/connex/esm/driver';
import { newThor } from '@vechain/connex-framework/dist/thor';
import type { DriverNoVendor } from '@vechain/connex-driver';
import { newVendor } from '@vechain/connex-framework';
import type { ConnexInstance, ConnexOptions } from './types';
import { normalizeGenesisBlock } from './genesis';
import type { WalletSource } from './wallet';
import { FullDriver } from './full-driver';
import { SignerManager } from './signer-manager';

const createConnexInstance = (options: ConnexOptions): ConnexInstance => {
    const { nodeUrl, genesis, source, walletConnectOptions } = options;

    const genesisBlock = normalizeGenesisBlock(genesis);

    const thorOnlyDriver: DriverNoVendor = createNoVendor(
        nodeUrl,
        genesisBlock,
    );

    const _source = source;

    const signerManager: SignerManager = new SignerManager(options, source);
    const fullDriver = new FullDriver(thorOnlyDriver, signerManager);

    const thor = newThor(fullDriver);
    const vendor = newVendor(fullDriver);

    const disconnect = async (): Promise<void> => {
        await signerManager.disconnect();
    };

    const setSource = (src: WalletSource): void => {
        if (src === 'wallet-connect' && !walletConnectOptions) {
            throw new Error('WalletConnect options are not provided');
        }

        if (src === 'veworld-extension' && !window.vechain) {
            throw new Error('VeWorld Extension is not installed');
        }

        if (src === 'sync' && !window.connex) {
            throw new Error('User is not in a Sync wallet');
        }

        signerManager.setSigner(src);
    };

    return {
        setSource,
        thor,
        vendor,
        disconnect,
        source: _source,
    };
};

export { createConnexInstance };

import { createNoVendor } from '@vechain/connex/esm/driver';
import { newThor } from '@vechain/connex-framework/dist/thor';
import type { DriverNoVendor } from '@vechain/connex-driver';
import { newVendor } from '@vechain/connex-framework';
import type { ConnexInstance, ConnexOptions } from './types';
import { normalizeGenesisBlock } from './genesis';
import { FullDriver } from './full-driver';
import { WalletManager } from './wallet-manager';

const createConnexInstance = (options: ConnexOptions): ConnexInstance => {
    const { nodeUrl, genesis } = options;

    const genesisBlock = normalizeGenesisBlock(genesis);

    const thorOnlyDriver: DriverNoVendor = createNoVendor(
        nodeUrl,
        genesisBlock,
    );

    const walletManager = new WalletManager(options);
    const fullDriver = new FullDriver(thorOnlyDriver, walletManager);

    const thor = newThor(fullDriver);
    const vendor = newVendor(fullDriver);

    return {
        thor,
        vendor,
        wallet: walletManager,
    };
};

export { createConnexInstance };

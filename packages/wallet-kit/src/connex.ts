import { createNoVendor } from '@vechain/connex/esm/driver';
import { newThor } from '@vechain/connex-framework/dist/thor';
import type { DriverNoVendor } from '@vechain/connex-driver';
import { newVendor } from '@vechain/connex-framework';
import type { ConnexOptions, ConnexWalletManager } from './types';
import { normalizeGenesisBlock } from './genesis';
import { FullDriver } from './full-driver';
import { WalletManager } from './wallet-manager';

class MultiWalletConnex {
    public readonly thor: Connex.Thor;
    public readonly vendor: Connex.Vendor;
    public readonly wallet: ConnexWalletManager;

    constructor(options: ConnexOptions) {
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

        this.thor = thor;
        this.vendor = vendor;
        this.wallet = walletManager;
    }
}

export { MultiWalletConnex };

import { createNoVendor, LazyDriver } from '@vechain/connex/esm/driver';
import { newThor } from '@vechain/connex-framework/dist/thor';
import type { DriverNoVendor } from '@vechain/connex-driver';
import { newVendor } from '@vechain/connex-framework';
import type { ConnexOptions } from './types';
import { normalizeGenesisBlock } from './genesis';
import { WalletManager } from './wallet-manager';

class MultiWalletConnex {
    public readonly thor: Connex.Thor;
    public readonly vendor: Connex.Vendor;
    public readonly wallet: WalletManager;

    constructor(options: ConnexOptions) {
        const { nodeUrl, genesis } = options;

        const genesisBlock = normalizeGenesisBlock(genesis);

        const thorOnlyDriver: DriverNoVendor = createNoVendor(
            nodeUrl,
            genesisBlock,
        );

        const walletManager = new WalletManager(options);
        const lazyDriver = new LazyDriver(Promise.resolve(walletManager));
        lazyDriver.setNoVendor(thorOnlyDriver);

        const thor = newThor(lazyDriver);
        const vendor = newVendor(lazyDriver);

        this.thor = thor;
        this.vendor = vendor;
        this.wallet = walletManager;
    }
}

export { MultiWalletConnex };

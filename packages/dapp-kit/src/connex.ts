import {
    DriverNoVendor,
    SimpleNet,
} from '@vechain/connex-driver/dist/index.js';
import { Framework } from '@vechain/connex-framework';
import { blake2b256 } from 'thor-devkit';
import type { ConnexOptions } from './types';
import { normalizeGenesisBlock } from './genesis';
import { WalletManager } from './wallet-manager';

const cache: Record<string, DriverNoVendor | undefined> = {};

const createThorDriver = (
    node: string,
    genesis: Connex.Thor.Block,
): DriverNoVendor => {
    const key = blake2b256(
        JSON.stringify({
            node,
            genesis,
        }),
    ).toString('hex');

    let driver = cache[key];
    if (!driver) {
        driver = new DriverNoVendor(new SimpleNet(node), genesis);
        cache[key] = driver;
    }
    return driver;
};

class MultiWalletConnex {
    public readonly thor: Connex.Thor;
    public readonly vendor: Connex.Vendor;
    public readonly wallet: WalletManager;

    constructor(options: ConnexOptions) {
        const { nodeUrl, genesis } = options;

        const genesisBlock = normalizeGenesisBlock(genesis);

        const driver = createThorDriver(nodeUrl, genesisBlock);

        const walletManager = new WalletManager(options);

        driver.signTx = walletManager.signTx.bind(walletManager);
        driver.signCert = walletManager.signCert.bind(walletManager);

        const framework = new Framework(driver);

        this.thor = framework.thor;
        this.vendor = framework.vendor;
        this.wallet = walletManager;
    }
}

export { MultiWalletConnex };

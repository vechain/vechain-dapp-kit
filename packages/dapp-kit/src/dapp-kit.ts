import type { Net } from '@vechain/connex-driver';
import { DriverNoVendor, SimpleNet } from '@vechain/connex-driver';
import { Framework } from '@vechain/connex-framework';
import * as ThorDevkit from 'thor-devkit';
import { WalletManager } from './classes';
import { DAppKitLogger, normalizeGenesisBlock } from './utils';
import type { DAppKitOptions } from './types';

const cache: Record<string, DriverNoVendor | undefined> = {};

const createThorDriver = (
    node: string,
    genesis: Connex.Thor.Block,
    net: Net,
): DriverNoVendor => {
    const key = ThorDevkit.blake2b256(
        JSON.stringify({
            node,
            genesis,
        }),
    ).toString('hex');

    let driver = cache[key];
    if (!driver) {
        driver = new DriverNoVendor(net, genesis);
        cache[key] = driver;
    }
    return driver;
};

class DAppKit {
    public readonly thor: Connex.Thor;
    public readonly vendor: Connex.Vendor;
    public readonly wallet: WalletManager;

    constructor(options: DAppKitOptions) {
        if (options.logLevel) {
            DAppKitLogger.configure(options.logLevel);
            DAppKitLogger.debug('DAppKit', 'constructor', options);
        }

        const { nodeUrl, genesis } = options;

        const genesisBlock = normalizeGenesisBlock(genesis);

        const net = options.customNet || new SimpleNet(nodeUrl);
        const driver = createThorDriver(nodeUrl, genesisBlock, net);

        const walletManager = new WalletManager(options);

        driver.signTx = walletManager.signTx.bind(walletManager);
        driver.signCert = walletManager.signCert.bind(walletManager);

        const framework = new Framework(driver);

        this.thor = framework.thor;
        this.vendor = framework.vendor;
        this.wallet = walletManager;
    }
}

export { DAppKit };

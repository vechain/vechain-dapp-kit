import {
    DriverNoVendor,
    SimpleNet,
} from '@vechain/connex-driver/dist/index.js';
import { Framework } from '@vechain/connex-framework';
import { blake2b256, Hex } from '@vechain/sdk-core';
import { WalletManager } from './classes';
import { DAppKitLogger, normalizeGenesisBlock } from './utils';
import type { DAppKitOptions } from './types';

const cache: Record<string, DriverNoVendor | undefined> = {};

/**
 * Create a new Thor driver
 *
 * @param node - The node URL
 * @param genesis - The genesis block
 */
const createThorDriver = (
    node: string,
    genesis: Connex.Thor.Block,
): DriverNoVendor => {
    // Stringify the certificate to hash
    const certificateToHash = JSON.stringify({
        node,
        genesis,
    });

    // Encode the certificate to hash
    const encodedCertificateToHash = new TextEncoder().encode(
        certificateToHash.normalize(),
    );

    // Get the key (the hash of the certificate) without 0x prefix
    const key: string = Hex.canon(blake2b256(encodedCertificateToHash, 'hex'));

    let driver = cache[key];
    if (!driver) {
        driver = new DriverNoVendor(new SimpleNet(node), genesis);
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

export { DAppKit };

import {
    DriverNoVendor,
    SimpleNet,
} from '@vechain/connex-driver/dist/index.js';
import { Framework } from '@vechain/connex-framework';
import { blake2b256, Hex } from '@vechain/sdk-core';
import { WalletManager } from './classes';
import { DAppKitLogger, normalizeGenesisBlock } from './utils';
import type { DAppKitOptions } from './types';
import { ethers } from 'ethers';
import { SignTypedDataOptions } from './types/types';

// Define an interface that extends DriverNoVendor to include signTypedData
interface DriverNoVendorExtended extends DriverNoVendor {
    signTypedData: (
        domain: ethers.TypedDataDomain,
        types: Record<string, ethers.TypedDataField[]>,
        value: Record<string, unknown>,
        options?: SignTypedDataOptions,
    ) => Promise<any>;
}

// Update the createThorDriver function to use the extended interface
const cache: Record<string, DriverNoVendorExtended | undefined> = {};

/**
 * START: TEMPORARY COMMENT
 * For hashing we will improve SDK conversion and encoding later
 * END: TEMPORARY COMMENT
 *
 * Create a new Thor driver
 *
 * @param node - The node URL
 * @param genesis - The genesis block
 */
const createThorDriver = (
    node: string,
    genesis: Connex.Thor.Block,
): DriverNoVendorExtended => {
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
        driver = new DriverNoVendor(
            new SimpleNet(node),
            genesis,
        ) as DriverNoVendorExtended;

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

        // Assign additional methods from walletManager to driver
        driver.signTx = walletManager.signTx.bind(walletManager);
        driver.signCert = walletManager.signCert.bind(walletManager);
        driver.signTypedData = walletManager.signTypedData.bind(walletManager); // Add the binding for signTypedData

        const framework = new Framework(driver);

        this.thor = framework.thor;
        this.vendor = framework.vendor;
        this.wallet = walletManager;
    }
}

export { DAppKit };

import { DriverNoVendor } from '@vechain/connex-driver/dist/driver-no-vendor';
import { SimpleNet } from '@vechain/connex-driver';
import type { Genesis } from './types';
import { normalizeGenesisBlock } from './genesis';

let previousDriver: DriverNoVendor | undefined;

const createDriverNoVendor = (
    nodeUrl: string,
    genesis: Genesis,
): DriverNoVendor => {
    const genesisBlock = normalizeGenesisBlock(genesis);

    if (previousDriver && previousDriver.genesis.id === genesisBlock.id) {
        return previousDriver;
    }

    const net = new SimpleNet(nodeUrl);

    const driver = new DriverNoVendor(net, genesisBlock);

    previousDriver = driver;

    return driver;
};

export { createDriverNoVendor };

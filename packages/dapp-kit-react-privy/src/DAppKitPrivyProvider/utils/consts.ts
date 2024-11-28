import { B3TR, VOT3 } from '@vechain/vebetterdao-contracts';
import { ThorClient } from '@vechain/sdk-network';

/**
 * Thor client instance
 */
export const THOR_CLIENT = ThorClient.at('https://mainnet.vechain.org');

/**
 * B3TR contract instance
 */
export const B3TR_CONTRACT = THOR_CLIENT.contracts.load(
    B3TR.address.mainnet,
    B3TR.abi
);

/**
 * VOT3 contract instance
 */
export const VOT3_CONTRACT = THOR_CLIENT.contracts.load(
    VOT3.address.mainnet,
    VOT3.abi
);

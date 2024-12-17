import { ThorClient } from '@vechain/sdk-network';

/**
 * Network URL.
 * Defaults to mainnet.
 */
export const NETWORK_URL =
    process.env.NEXT_PUBLIC_NETWORK_URL ?? 'https://mainnet.vechain.org';

/**
 * Thor client instance
 */
export const THOR_CLIENT = ThorClient.at(NETWORK_URL);

/**
 * Delegator url for the account abstraction factory contract
 */
export const DELEGATOR_URL = process.env.NEXT_PUBLIC_DELEGATOR_URL as string;

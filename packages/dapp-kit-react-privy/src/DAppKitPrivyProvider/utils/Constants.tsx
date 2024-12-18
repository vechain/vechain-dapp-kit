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

export const ACCOUNT_FACTORY_ADDRESSES = {
    '14018334920824264832118464179726739019961432051877733167310318607178':
        '0xC06Ad8573022e2BE416CA89DA47E8c592971679A',
    '1176455790972829965191905223412607679856028701100105089447013101863':
        '0x7EABA81B4F3741Ac381af7e025f3B6e0428F05Fb',
} as const;

export const EXPLORER_URL = {
    '14018334920824264832118464179726739019961432051877733167310318607178':
        'https://vechainstats.com/transaction/',
    '1176455790972829965191905223412607679856028701100105089447013101863':
        'https://explore-testnet.vechain.org/transactions/',
} as const;

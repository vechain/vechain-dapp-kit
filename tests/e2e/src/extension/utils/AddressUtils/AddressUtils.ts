import { addressUtils, Hex0x } from '@vechain/sdk-core';

/**
 * Validate the hex string. Throws an Error if not valid
 * @param hex - the input hex string
 * @throws an error if the input is not a valid hex string
 */
const validate = (hex: string) => {
    if (!addressUtils.isAddress(hex))
        throw Error(`Provided hex value is not valid ${hex}`);
};

/**
 * Checks if two addresses are equal. Returns true if both values are strings AND:
 *  - The two values are equal OR
 *  - The checksumed addresses are equal
 *
 * @param address1 - the first address
 * @param address2 - the second address
 * @returns true if the addresses are equal
 */
export const compareAddresses = (
    address1: unknown | string,
    address2: unknown | string,
): boolean => {
    if (typeof address1 !== 'string' || typeof address2 !== 'string')
        return false;

    if (address2 === address1) return true;

    try {
        address1 = Hex0x(address1);
        address2 = Hex0x(address2);
        return (
            addressUtils.toERC55Checksum(address1 as string) ===
            addressUtils.toERC55Checksum(address2 as string)
        );
    } catch (e) {
        return false;
    }
};

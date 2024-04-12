import { addressUtils } from '@vechain/sdk-core';

const PREFIX = '0x';
const PREFIX_REGEX = /^0[xX]/;

/**
 * Returns the provided hex string with the hex prefix added.
 * If the prefix already exists the string is returned unmodified.
 * If the string contains an UPPER case `X` in the prefix it will be replaced with a lower case `x`
 * @param hex - the input hex string
 * @returns the input hex string with the hex prefix added
 * @throws an error if the input is not a valid hex string
 */
const addPrefix = (hex: string): string => {
    validate(hex);
    return PREFIX_REGEX.test(hex)
        ? hex.replace(PREFIX_REGEX, PREFIX)
        : `${PREFIX}${hex}`;
};

/**
 * Validate the hex string. Throws an Error if not valid
 * @param hex - the input hex string
 * @throws an error if the input is not a valid hex string
 */
const validate = (hex: string) => {
    if (!isValid(hex)) throw Error(`Provided hex value is not valid ${hex}`);
};

export const isValid = (addr: string): boolean => {
    return addressUtils.isAddress(addr);
};

/**
 * Checks if two addresses are equal. Returns true if both values are strings AND:
 *  - The two values are equal OR
 *  - The checksumed addresses are equal
 *
 * @param address1
 * @param address2
 */
export const compareAddresses = (
    address1: unknown,
    address2: unknown,
): boolean => {
    if (typeof address1 !== 'string' || typeof address2 !== 'string')
        return false;

    if (address2 === address1) return true;

    try {
        address1 = addPrefix(address1);
        address2 = addPrefix(address2);
        return (
            addressUtils.toChecksummed(address1 as string) ===
            addressUtils.toChecksummed(address2 as string)
        );
    } catch (e) {
        return false;
    }
};

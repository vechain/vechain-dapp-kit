import { isValidAddress } from '../../../utils/AddressUtils';
import { ethers } from 'ethers';

/**
 *  Get the account balance for the given address
 * @param address  The address of the account to get the balance for
 * @returns  The account balance
 */
export const getAccountBalance = async (
    thor: Connex.Thor,
    address?: string,
) => {
    if (!!address && isValidAddress(address)) return 0;

    if (!address) throw new Error('Address is required');
    const account = await thor.account(address).get();

    return {
        balance: ethers.formatEther(account.balance).toString(),
        energy: ethers.formatEther(account.energy).toString(),
    };
};

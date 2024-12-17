import { ABIContract } from '@vechain/sdk-core';
import { THOR_CLIENT } from '../utils/Constants';
import { SimpleAccountABI } from '../assets';

export const getAbstractAddress = async (address: string): Promise<string> => {
    const account = await THOR_CLIENT.contracts.executeCall(
        process.env.NEXT_PUBLIC_AA_FACTORY as string,
        ABIContract.ofAbi(SimpleAccountABI).getFunction('getAccountAddress'),
        [address],
    );

    return String(account.result.array?.[0]);
};

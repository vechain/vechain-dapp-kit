import { ABIFunction } from '@vechain/sdk-core';
import { THOR_CLIENT } from './Constants';

export const getAbstractAddress = async (address: string): Promise<string> => {
    const account = await THOR_CLIENT.contracts.executeCall(
        process.env.NEXT_PUBLIC_AA_FACTORY as string,
        new ABIFunction({
            constant: true,
            inputs: [
                {
                    name: 'owner',
                    type: 'address',
                },
            ],
            name: 'getAccountAddress',
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        }),
        [address],
    );

    return String(account.result.array?.[0]);
};

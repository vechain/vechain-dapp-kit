import { ThorClient } from '@vechain/sdk-network';
import { VeChainSignerDAppKit } from '@vechain/dapp-kit';

export const Counter = {
    abi: {
        counter: {
            inputs: [],
            name: 'counter',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        increment: {
            inputs: [],
            name: 'increment',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
    },
    address: '0x8384738c995d49c5b692560ae688fc8b51af1059',
    delegateURL: 'https://sponsor-testnet.vechain.energy/by/90',
    load: (thor: ThorClient, signer?: VeChainSignerDAppKit) => {
        return thor.contracts.load(
            Counter.address,
            [Counter.abi.counter, Counter.abi.increment] as const,
            signer,
        );
    },
} as const;

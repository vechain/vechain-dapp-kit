import { useCallback, useEffect, useMemo, useState } from 'react';
import { useConnex } from '@vechainfoundation/react-wallet-kit';
import type { abi } from 'thor-devkit';

const _counter: abi.Function.Definition = {
    inputs: [],
    name: 'counter',
    outputs: [
        {
            internalType: 'uint256',
            name: 'count',
            type: 'uint256',
        },
    ],
    stateMutability: 'view',
    type: 'function',
};

const _increment: abi.Function.Definition = {
    inputs: [],
    name: 'increment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
};

type IncrementStatus = 'idle' | 'in-wallet' | 'pending' | 'error';

interface UseCounter {
    count: number;
    increment: () => Promise<void>;
    status: IncrementStatus;
    address: string;
    error: string | null;
}

export const useCounter = (): UseCounter => {
    const { thor } = useConnex();

    const [count, setCount] = useState<number>(0);
    const [status, setStatus] = useState<IncrementStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const contract = useMemo(
        () => thor.account('0x8384738c995d49c5b692560ae688fc8b51af1059'),
        [thor],
    );

    const setValue = useCallback(async () => {
        const res = await contract.method(_counter).call();

        setCount(res.decoded.count as number);
    }, [contract]);

    useEffect(() => {
        setValue().catch(() => setStatus('error'));
    }, [setValue]);

    const increment = useCallback(async (): Promise<void> => {
        setError(null);

        try {
            setStatus('in-wallet');

            await contract
                .method(_increment)
                .transact()
                .delegate('https://sponsor-testnet.vechain.energy/by/90')
                .request();

            setStatus('pending');

            await thor.ticker().next();

            await setValue()
                .then(() => setStatus('idle'))
                .catch(() => setStatus('error'));
        } catch (e) {
            setStatus('error');
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('Unknown error');
            }
            throw e;
        }
    }, [thor, contract, setValue]);

    return { count, increment, status, address: contract.address, error };
};

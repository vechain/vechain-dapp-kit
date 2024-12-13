import {
    useThor,
    useWallet,
    useWalletModal,
    WalletButton,
} from '@vechain/dapp-kit-react';
import { useEffect, useMemo, useState } from 'react';
import { Counter } from './counter.ts';
import { friendlyAddress } from '@vechain/dapp-kit-ui';

function App() {
    const thor = useThor();
    const [count, setCount] = useState(BigInt(0));
    const [error, setError] = useState<Error>();
    const [txId, setTxId] = useState('');
    const [loading, setLoading] = useState(false);
    const { account, accountDomain, isAccountDomainLoading, signer } = useWallet();

    const { open } = useWalletModal();
    const [buttonText, setButtonText] = useState('Connect Custom Button');

    const counterContract = useMemo(() => {
        return Counter.load(thor, signer);
    }, [thor, signer]);

    useEffect(() => {
        const loadCounter = async () => {
            const counter = await counterContract.read.counter({
                revision: {},
            });
            setCount(counter[0]);
        };

        loadCounter();
    }, [counterContract, loading, error, txId]);

    useEffect(() => {
        if (account) {
            const addressOrDomain =
                accountDomain && !isAccountDomainLoading
                    ? accountDomain
                    : friendlyAddress(account || '');
            setButtonText(`Disconnect from ${addressOrDomain}`);
        } else {
            setButtonText('Connect Custom Button');
        }
    }, [account, accountDomain, isAccountDomainLoading]);

    useEffect(() => {
        console.log('signer', signer);
    }, [signer]);

    const testTx = async () => {
        setTxId('');
        setError(undefined);
        try {
            setLoading(true);

            // TODO: Set the delegation URL so that transactions are free
            const tx = await counterContract.transact.increment();

            const receipt = await tx.wait();
            if (receipt == null || receipt.reverted) {
                setError(new Error('Transaction failed'));
                return;
            }

            setTxId(receipt.meta.txID!);
        } catch (e) {
            setError(e as Error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>React JS</h2>
            <div className="label">kit button:</div>
            <WalletButton />
            <div className="label">custom button:</div>
            <button onClick={open}>{buttonText}</button>
            <br></br>
            <div className="label">Counter</div>
            {account && !loading && <button onClick={testTx}>Increment</button>}
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {account && txId && <div>Transaction ID: {txId}</div>}
            <div>Counter: {count.toString()}</div>
        </div>
    );
}

export default App;

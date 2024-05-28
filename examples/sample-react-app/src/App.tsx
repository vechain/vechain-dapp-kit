import {
    useWallet,
    useWalletModal,
    WalletButton,
} from '@vechain/dapp-kit-react';
import { useCallback, useEffect, useState } from 'react';
import { useCounter } from './hooks/useCounter';

function App() {
    const { account, setSource, connect, source } = useWallet();
    const counter = useCounter();
    const { open, onConnectionStatusChange } = useWalletModal();
    const [buttonText, setButtonText] = useState('Connect Custom Button');

    useEffect(() => {
        const handleConnected = (address: string | null) => {
            if (address) {
                const formattedAddress = `${address.slice(
                    0,
                    6,
                )}...${address.slice(-4)}`;
                setButtonText(`Disconnect from ${formattedAddress}`);
            } else {
                setButtonText('Connect Custom Button');
            }
        };

        handleConnected(account);

        onConnectionStatusChange(handleConnected);
    }, [account, onConnectionStatusChange]);

    /**
     * TODO: DApp Kit and SDK are not playing nice with other here, we should be ablo load the contract and do "contract.transact.increment()"
     * But instead we have to use various functions from each. How can we improve it?
     */
    const sendCustomTx = useCallback(async () => {
        if (source) {
            console.log(await counter.counter());
            const { wait } = await counter.increment();
            const receipt = await wait();
            console.log(receipt);
        }
    }, [counter, source]);

    const connectWithVeworld = useCallback(() => {
        setSource('veworld');
        connect();
    }, [setSource, connect]);

    const connectWithWalletConnect = useCallback(() => {
        setSource('wallet-connect');
        connect();
    }, [setSource, connect]);

    const connectWithSync2 = useCallback(() => {
        setSource('sync2');
        connect();
    }, [setSource, connect]);

    return (
        <div className="container v-stack">
            <h2>React JS</h2>
            <div className="label">kit button:</div>
            <WalletButton />
            <div className="label">custom kit button:</div>
            <button className="custom" onClick={open}>
                {buttonText}
            </button>
            <div className="v-stack">
                <div className="label">Send counter transaction:</div>
                <button className="custom" onClick={sendCustomTx}>
                    Send Custom transaction
                </button>
            </div>
            {account ? (
                <div className="v-stack">
                    <div className="label">Send counter transaction:</div>
                    <button className="custom" onClick={sendCustomTx}>
                        Send Custom transaction
                    </button>
                </div>
            ) : (
                <div className="v-stack">
                    <div className="label">Connect without modal:</div>
                    <button className="custom" onClick={connectWithVeworld}>
                        Connect with veworld
                    </button>
                    <button
                        className="custom"
                        onClick={connectWithWalletConnect}
                    >
                        Connect with wallet connect
                    </button>
                    <button className="custom" onClick={connectWithSync2}>
                        Connect with sync 2
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;

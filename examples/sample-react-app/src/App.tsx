import {
    WalletButton,
    useConnex,
    useWallet,
    useWalletModal,
} from '@vechain/dapp-kit-react';
import { useCallback, useEffect, useState } from 'react';

function App() {
    const { account, setSource, connect } = useWallet();
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

    const { vendor } = useConnex();

    const sendVetTransaction = useCallback(() => {
        if (account) {
            const clauses = [
                {
                    to: account,
                    value: '1000000000000000000', // 1 vet
                },
            ];
            vendor.sign('tx', clauses).signer(account).request();
        }
    }, [account, vendor]);

    const sendVthoTransaction = useCallback(() => {
        if (account) {
            const vthoClauses = [
                {
                    data: '0xa9059cbb000000000000000000000000d420d35c6a07e58a188d776114267b0b0a2392350000000000000000000000000000000000000000000000000de0b6b3a7640000',
                    to: account,
                    value: 0,
                }, // 1 vtho
            ];
            vendor.sign('tx', vthoClauses).signer(account).request();
        }
    }, [account, vendor]);

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
            {account ? (
                <div className="v-stack">
                    <div className="label">Send transaction:</div>
                    <button className="custom" onClick={sendVetTransaction}>
                        Send vet transaction
                    </button>
                    <button className="custom" onClick={sendVthoTransaction}>
                        Send vtho transaction
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

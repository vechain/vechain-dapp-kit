import {
    WalletButton,
    useWallet,
    useWalletModal,
} from '@vechain/dapp-kit-react';
import { useEffect, useState } from 'react';

function App() {
    const { account, signTypedData } = useWallet();
    const { open, onConnectionStatusChange } = useWalletModal();
    const [buttonText, setButtonText] = useState('Connect Custom Button');

    // All properties on a domain are optional
    const domain = {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    };

    // The named list of all type definitions
    const types = {
        Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
        ],
        Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person' },
            { name: 'contents', type: 'string' },
        ],
    };

    // The data to sign
    const value = {
        from: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Hello, Bob!',
    };

    const signTypedDataHandler = async () => {
        signTypedData(domain, types, value);
    };

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

    return (
        <div className="container">
            <h2>React JS</h2>
            <div className="label">kit button:</div>
            <button onClick={signTypedDataHandler}>Sign Typed Data</button>
            <WalletButton />
            <div className="label">custom button:</div>
            <button onClick={open}>{buttonText}</button>
        </div>
    );
}

export default App;

import {
    WalletButton,
    useSDK,
    useWallet,
    useWalletModal,
} from '@vechain/dapp-kit-react';
import { ERC20_ABI, VTHO_ADDRESS } from '@vechain/sdk-core';
import { useEffect, useState } from 'react';

function App() {
    const { account, signer } = useWallet();

    const thor = useSDK().thor;
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

    useEffect(() => {
        console.log('signer', signer);
    }, [signer]);

    const testTx = async () => {
        const vthoContract = thor.contracts.load(
            VTHO_ADDRESS,
            ERC20_ABI,
            signer,
        );

        vthoContract.transact.transfer(
            '0x0000000000000000000000000000000000000000',
            1000000000000000000n,
        );
    };

    return (
        <div className="container">
            <h2>React JS</h2>
            <div className="label">kit button:</div>
            <WalletButton />
            <div className="label">custom button:</div>
            <button onClick={open}>{buttonText}</button>
            <button onClick={testTx}>Test TX</button>
        </div>
    );
}

export default App;

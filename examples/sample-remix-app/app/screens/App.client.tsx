import {
    DAppKitProvider,
    WalletButton,
    WalletConnectOptions,
    useWallet,
    useWalletModal,
} from '@vechain/dapp-kit-react';
import { useEffect, useState } from 'react';

const walletConnectOptions: WalletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: window.location.origin,
        icons: [`${window.location.origin}/images/logo/my-dapp.png`],
    },
};

const AppContent = () => {
    const { account } = useWallet();
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

    return (
        <div className="container">
            <h2>React JS</h2>
            <div className="label">kit button:</div>
            <WalletButton />
            <div className="label">custom button:</div>
            <button onClick={open}>{buttonText}</button>
        </div>
    );
};

export const App = () => {
    return (
        <DAppKitProvider
            nodeUrl={'https://testnet.vechain.org/'}
            genesis={'test'}
            usePersistence
            walletConnectOptions={walletConnectOptions}
        >
            <AppContent />
        </DAppKitProvider>
    );
};

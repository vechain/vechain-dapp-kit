// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/function-component-definition */
import { type ReactElement, useEffect, useState } from 'react';
import {
    WalletButton,
    DAppKitProvider,
    useWalletModal,
    useWallet,
} from '@vechain/dapp-kit-react';
import type { WalletConnectOptions } from '@vechain/dapp-kit';

const Button = (): ReactElement => {
    const { account } = useWallet();
    const { open, onConnected } = useWalletModal();
    const [buttonText, setButtonText] = useState('Connect Custom Button');

    useEffect(() => {
        const handleConnected = (address: string | null): void => {
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

        onConnected(handleConnected);
    }, [account, onConnected]);

    return (
        <div className="container">
            <h2>Next JS</h2>
            <div className="label">kit button:</div>
            <WalletButton />
            <div className="label">custom button:</div>
            <button onClick={open} type="button">
                {buttonText}
            </button>
        </div>
    );
};

const walletConnectOptions: WalletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: [
            typeof window !== 'undefined'
                ? `${window.location.origin}/images/logo/my-dapp.png`
                : '',
        ],
    },
};

const HomePage = (): ReactElement => {
    return (
        <DAppKitProvider
            genesis="test"
            nodeUrl="https://testnet.vechain.org/"
            usePersistence
            walletConnectOptions={walletConnectOptions}
        >
            <Button />
        </DAppKitProvider>
    );
};

// eslint-disable-next-line import/no-default-export
export default HomePage;

'use client'; // This is a client component
import { type ReactElement, useEffect, useState } from 'react';
import {
    useWallet,
    useWalletModal,
    WalletButton,
} from '@vechain/dapp-kit-react';

const Button = (): ReactElement => {
    const { account, signer } = useWallet();
    const { open, onConnectionStatusChange } = useWalletModal();
    const [buttonText, setButtonText] = useState('Connect Custom Button');

    const sendTx = () =>
        signer?.sendTransaction({
                clauses: [
                    {
                        to: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
                        value: '0x1',
                        data: '0x',
                    },
                ],
                comment: 'Send 1 Wei',
            });

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

        onConnectionStatusChange(handleConnected);
    }, [account, onConnectionStatusChange]);

    return (
        <div className="container">
            <h2>Next JS</h2>
            <div className="label">kit button:</div>
            <WalletButton />
            <div className="label">custom button:</div>
            <button onClick={open} type="button">
                {buttonText}
            </button>
            <div className="label">TX</div>
            <button onClick={sendTx}>Send</button>
        </div>
    );
};

const HomePage = (): ReactElement => {
    return <Button />;
};

// eslint-disable-next-line import/no-default-export
export default HomePage;

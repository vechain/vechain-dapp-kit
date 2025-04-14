import {
    useWallet,
    useWalletModal,
    WalletButton,
} from '@vechain/dapp-kit-react';
import { friendlyAddress } from '@vechain/dapp-kit-ui';
import { useEffect, useState } from 'react';

function App() {
    const { account, signer, accountDomain, isAccountDomainLoading } =
        useWallet();

    const { open } = useWalletModal();
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

    const signTypedData = () =>
        signer.signTypedData(
            {
                name: 'Test Data',
                version: '1',
                chainId: 1,
                verifyingContract: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
            },
            { test: [{ name: 'test', type: 'address' }] },
            { test: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68' },
        );

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

    return (
        <div className="container">
            <h2>React JS</h2>
            <div className="label">kit button:</div>
            <WalletButton />
            <div className="label">custom button:</div>
            <button onClick={open}>{buttonText}</button>

            <div className="label">TX</div>
            <button onClick={sendTx}>Send TX</button>
            <div className="label">Typed Data</div>
            <button onClick={signTypedData}>Sign Typed Data</button>
        </div>
    );
}

export default App;

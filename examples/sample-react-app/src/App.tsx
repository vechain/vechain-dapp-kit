import {
    WalletButton,
    useWallet,
    useWalletModal,
} from '@vechain/dapp-kit-react';
import { friendlyAddress } from '@vechain/dapp-kit-ui';
import { useEffect, useState } from 'react';

function App() {
    const { account, accountDomain, isAccountDomainLoading } = useWallet();

    const { open } = useWalletModal();
    const [buttonText, setButtonText] = useState('Connect Custom Button');

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
        </div>
    );
}

export default App;
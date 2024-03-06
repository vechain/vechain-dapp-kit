import { useConnex, useWallet } from '@vechain/dapp-kit-react';
import { useCallback } from 'react';

function App() {
    const { account, setSource, connect, disconnect, source } = useWallet();
    const { vendor } = useConnex();

    const sendVetTransaction = useCallback(() => {
        if (account) {
            const clauses = [
                {
                    to: account,
                    value: '1000000000000000000', // vets
                },
            ];
            return vendor.sign('tx', clauses).signer(account).request();
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

    const handleDisconnect = useCallback(() => {
        disconnect();
    }, [disconnect]);

    return (
        <div className="container">
            {!account && (
                <>
                    <button onClick={connectWithVeworld}>
                        connect with veworld
                    </button>
                    <button onClick={connectWithWalletConnect}>
                        connect with wallet connect
                    </button>
                </>
            )}
            {account && (
                <>
                    <button onClick={handleDisconnect}>disconnect</button>
                    <button onClick={sendVetTransaction}>
                        send vet transaction
                    </button>
                </>
            )}
            <p>current source: {source || 'null'}</p>
        </div>
    );
}

export default App;

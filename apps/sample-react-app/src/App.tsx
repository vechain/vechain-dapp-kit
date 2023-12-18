import {
    ConnectButtonWithModal,
    useWalletModal,
} from '@vechain/dapp-kit-react';

function App() {
    const { open } = useWalletModal();

    return (
        <div>
            <h2>React</h2>
            <ConnectButtonWithModal />
            <br />
            <button onClick={open}>Connect Custom Button</button>
        </div>
    );
}

export default App;

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import {
    ConnectButtonWithModal,
    useWalletModal,
} from '@vechain/dapp-kit-react';

function App() {
    const { open } = useWalletModal();

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={open}>Connect Custom Button</button>
            </div>

            <br />

            <div className="card">
                <ConnectButtonWithModal />
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
}

export default App;

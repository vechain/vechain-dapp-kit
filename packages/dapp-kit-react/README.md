# `@vechain/dapp-kit-react`

## Why ?

-   Allow easy interaction with all wallets.
-   Connex is designed to play nice with one wallet at a time, this library provides a layer on top of Connex to easily
    allow interaction with all wallets.
-   Easy setup for wallet connect

## Installation

-   See the parent [README](../../README.md) for installation instructions.

### Build

```bash
yarn build
```

## Usage

```bash
yarn add @vechain/dapp-kit-react
```

-   Optional: Configure wallet connect options

```typescript
import type { WalletConnectOptions } from '@vechain/dapp-kit';

const walletConnectOptions: WalletConnectOptions = {
    // Create your project here: https://cloud.walletconnect.com/sign-up
    projectId: '<PROJECT_ID>',
    metadata: {
        name: 'My dApp',
        description: 'My dApp description',
        // Your app URL
        url: window.location.origin,
        // Your app Icon
        icons: [`${window.location.origin}/images/my-dapp-icon.png`],
    },
};
```

-   Initialise the `DAppKitProvider`

```typescript jsx
import { DAppKitProvider } from '@vechain/dapp-kit-react';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <DAppKitProvider
            // REQUIRED: The URL of the node you want to connect to
            nodeUrl={'https://testnet.vechain.org/'}
            // OPTIONAL: Required if you're not connecting to the main net
            genesis={'test'}
            // OPTIONAL: Whether or not to persist state in local storage (account, wallet source)
            usePersistence={true}
            // OPTIONAL: Options to enable wallet connect
            walletConnectOptions={walletConnectOptions}
            // OPTIONAL: A log level for console logs
            logLevel="DEBUG"
        >
            <App />
        </DAppKitProvider>
    </React.StrictMode>,
);
```

-   Use the hooks provided by the `DAppKitProvider`

```typescript jsx
import { useWallet, useConnex } from '@vechain/dapp-kit-react';
import type { WalletSource } from '@vechain/dapp-kit';

// type WalletSource = 'wallet-connect' | 'veworld' | 'sync2' | 'sync';
const mySource: WalletSource = 'veworld';

const { connect, setSource } = useWallet();

setSource(mySource);

const { account } = await connect();

//Start using Connex thor/ vendor
const { vendor, thor } = useConnex();
```

### UI Option 1: Modal + Button

-   Use the `ConnectWalletButton` component to display a modal with the available wallets

```typescript jsx
import { ConnectButtonWithModal } from '@vechain/dapp-kit-react';
import { useWallet } from '@vechain/dapp-kit-react';

const MyComponent = (): JSX.Element => {
    const { account } = useWallet();

    useEffect(() => {
        if (account) {
            // account connected!!
        }
    }, [account]);

    return (
        <>
            <ConnectButtonWithModal />
        </>
    );
};
```

### Option 2: Modal + Custom Button

-   Use the `ConnectWalletModal` component to display a modal with the available wallets

```typescript jsx
import { useWallet, useWalletModal } from '@vechain/dapp-kit-react';

export const MyComponent = (): JSX.Element => {
    const { account } = useWallet();
    const { open, close } = useWalletModal();

    useEffect(() => {
        if (account) {
            // account connected!!
        }
    }, [account]);

    return (
        <>
            <button onClick={open}>Connect Wallet</button>
        </>
    );
};
```

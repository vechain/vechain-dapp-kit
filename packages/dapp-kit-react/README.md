# `@vechain/dapp-kit-react`

-   An extension of `@vechain/connex` to containing various hooks and components to simplify wallet connection and interaction
-   Please refer to the official documentation [here](https://docs.vechain.org/developer-resources/sdks-and-providers/dapp-kit/react/installation)

---

## Installation

### Build

```bash
yarn build
```

---

## Usage

```bash
yarn add @vechain/dapp-kit-react
```

---

### Optional: Wallet Connection Options

```typescript
import type { WalletConnectOptions } from '@vechain/dapp-kit';

const walletConnectOptions: WalletConnectOptions = {
    projectId: '<PROJECT_ID>', // Create your project here: https://cloud.walletconnect.com/sign-up
    metadata: {
        name: 'My dApp',
        description: 'My dApp description',
        url: window.location.origin, // Your app URL
        icons: [`${window.location.origin}/images/my-dapp-icon.png`], // Your app Icon
    },
};
```

---

### Initialise the `DAppKitProvider`

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

---

### Hooks

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

---

### UI Components

1. Modal + Button

    - Use the `ConnectWalletButton` component to display a modal with the available wallets

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

2. Custom Button

-   Leverage `useWalletModal` to open and close the built-in wallet Modal

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

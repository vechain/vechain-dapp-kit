# `@vechainfoundation/react-wallet-kit`

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
yarn add @vechainfoundation/react-wallet-kit
```

```typescript
import type { Options } from '@vechain/connex';

const nodeOptions: Omit<Options, 'signer'> = {
    node: 'https://testnet.vechain.org/',
    network: 'test',
};
```

-   Optional: Configure wallet connect options

```typescript
import type { WalletConnectOptions } from '@vechainfoundation/wallet-kit';

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

-   Initialise the `ConnexVendor`

```typescript jsx
import { ConnexProvider } from '@vechainfoundation/react-wallet-kit';

export const App = (): JSX.Element => {
    return (
        <>
            <ConnexProvider
                key="connex"
                nodeOptions={nodeOptions}
                persistState={false} // Optional - default: false - If true, account and source will be persisted in local storage
                walletConnectOptions={walletConnectOptions}
            >
                <YourApp />
            </ConnexProvider>
        </>
    );
};
```

-   Use the hooks provided by the `ConnexProvider`

```typescript jsx
import { useWallet, useConnex } from '@vechainfoundation/react-wallet-kit';
import type { WalletSource } from '@vechainfoundation/wallet-kit';

// type WalletSource = 'wallet-connect' | 'veworld-extension' | 'sync2' | 'sync';
const mySource: WalletSource = 'veworld-extension';

const { connect, setSource } = useWallet();

setSource(mySource);

const { account } = await connect();

//Start using Connex thor/ vendor
const { vendor, thor } = useConnex();
```

### UI Option 1: Modal + Button

-   Use the `ConnectWalletButton` component to display a modal with the available wallets

```typescript jsx
import { ConnectWalletButton } from '@vechainfoundation/react-wallet-kit';
import { useWallet } from '@vechainfoundation/react-wallet-kit';

const MyComponent = (): JSX.Element => {
    const { account } = useWallet();

    useEffect(() => {
        if (account) {
            // account connected!!
        }
    }, [account]);

    return (
        <>
            <ConnectWalletButton />
        </>
    );
};
```

### Option 2: Modal + Custom Button

-   Use the `ConnectWalletModal` component to display a modal with the available wallets

```typescript jsx
import {
    ConnectWalletModal,
    useWallet,
    useWalletModal,
} from '@vechainfoundation/react-wallet-kit';

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
            <ConnectWalletModal />
        </>
    );
};
```

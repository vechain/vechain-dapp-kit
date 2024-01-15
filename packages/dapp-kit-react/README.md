# `@vechain/dapp-kit-react`

The Vechain DApp Kit serves as a sophisticated layer built upon @vechain/connex, providing a simplified and efficient avenue for engaging with a multitude of Vechain wallets. This innovative toolkit enhances the ease of interaction, offering developers a seamless bridge to connect with diverse Vechain wallet functionalities. For more information, please refer to the official [Vechain Docs](https://docs.vechain.org/developer-resources/sdks-and-providers/dapp-kit)

## Installation

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
import { WalletButton } from '@vechain/dapp-kit-react';
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
            <WalletButton />
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

# `@vechainfoundation/wallet-connect`

## Usage

-   It is recommended to use `@vechainfoundation/wallet-kit` which includes this package.
-   See it's usage here [README](../wallet-kit/README.md) for installation instructions.

```bash
yarn add @vechainfoundation/wallet-connect
```

-   Initialise your wallet connect options

```typescript
import type { WalletConnectOptions } from '@vechainfoundation/wallet-connect';

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

-   Create your wallet connect client

```typescript
import {
    createWcClient,
    newWcSigner,
    createWcModal,
} from '@vechainfoundation/wallet-connect';
import type {
    WCModal,
    WCSigner,
    WCClient,
} from '@vechainfoundation/wallet-connect';

// Optional
const myCustomModal: WCModal | undefined = {
    //... your custom modal
};

/**
 * Handle disconnect
 * - users can disconnect remotely in their wallet
 */
const onDisconnected = () => {
    //... your disconnect handler
};

const { projectId, metadata } = walletConnectOptions;

// client's are cached by projectId
const wcClient: WCClient = createWcClient({
    projectId,
    metadata,
});

// createWcModal caches the modal by projectId
const web3Modal: WCModal = customWcModal
    ? customWcModal
    : createWcModal(projectId);

// newWcSigner does not cache the signer
const signer: WCSigner = newWcSigner({
    genesisId, // the genesis Id of your network
    wcClient,
    web3Modal,
    onDisconnected,
});
```

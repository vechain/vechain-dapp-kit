# `@vechainfoundation/dapp-kit`

## Why ?

-   Allow easy interaction with all wallets.
-   Connex is designed to play nice with one wallet at a time, this library provides a layer on top of Connex to easily
    allow interaction with all wallets.
-   Easy setup for wallet connect.

## Installation

-   See the parent [README](../../README.md) for installation instructions.

### Build

```bash
yarn build
```

## Usage

```bash
yarn add @vechainfoundation/dapp-kit
```

-   Optional: Configure wallet connect options

```typescript
import type { WalletConnectOptions } from '@vechainfoundation/dapp-kit';

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

-   Create a new instance of `DAppKit` and pass in the options
-   `thor` will be ready to use to interact with the chain, but calling any methods requiring a wallet will throw an
    error. See the next step to finalise the setup.

```typescript
const { thor, vendor, wallet } = new DAppKit({
    nodeUrl: 'https://sync-testnet.vechain.org/', //Required
    genesis: 'main', //Optional - "main" | "test" | Connex.Thor.Block
    walletConnectOptions, //Optional
});
```

-   You can set the wallet source when the user selects a wallet, or if you want to default to a specific wallet.
-   Connex is ready to use as normal

```typescript
import type { WalletSource } from '@vechainfoundation/dapp-kit';

// type WalletSource = 'wallet-connect' | 'veworld' | 'sync2' | 'sync';
const mySource: WalletSource = 'veworld';

wallet.setSource('veworld');
```

-   Connect to the wallet. This will return the user's address
-   `verified` indicates whether a certificate is signed by the user. If a sign in is required and the account is not
    verified, you should request a subsequent certificate sign in

```typescript
const {account, verified} = await wallet.connect();

const tx = await thor.account("0x...123").method(...).transact().signer(account).request();
const certRes = await vendor.sign("cert", {...}).requset();
```

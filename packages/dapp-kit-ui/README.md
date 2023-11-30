# `@vechainfoundation/dapp-kit-ui`

## Why ?

-   Creating some reusable UI components for connecting wallets
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
yarn add @vechainfoundation/dapp-kit-ui
```

-   In your root `main.ts`

```typescript
import type { WalletConnectOptions } from '@vechainfoundation/dapp-kit';
import type { Options } from '@vechain/connex';
import { configureThorModal } from '@vechainfoundation/dapp-kit-ui';

const walletConnectOptions: WalletConnectOptions = {
    projectId: '<PROJECT_ID>', // Create your project here: https://cloud.walletconnect.com/sign-up
    metadata: {
        name: 'My dApp',
        description: 'My dApp description',
        url: window.location.origin, // Your app URL
        icons: [`${window.location.origin}/images/my-dapp-icon.png`], // Your app Icon
    },
};

const nodeOptions: Omit<Options, 'signer'> = {
    node: 'https://testnet.vechain.org/',
    network: 'test',
};

configureThorModal(vechainWalletKitOptions);
```

-   In your root `index.html`. This will add a button to your page, when clicked it will open a modal with the wallet
    connect QR code.

```html
<body>
    <vwk-connect-button-with-modal mode="DARK"></vwk-connect-button-with-modal>
</body>
```

# `@vechain/dapp-kit-ui`

## Why ?

-   Creating some reusable UI components for connecting wallets
-   Allow easy interaction with all wallets.
-   Connex is designed to play nice with one wallet at a time, this library provides a layer on top of Connex to easily
    allow interaction with all wallets.
-   Easy setup for wallet connect.

## Installation

### Build

```bash
yarn build
```

## Usage

```bash
yarn add @vechain/dapp-kit-ui
```

-   In your root `main.ts`

```typescript
import type { WalletConnectOptions, DAppKitOptions } from '@vechain/dapp-kit';
import { DAppKitUI } from '@vechain/dapp-kit-ui';

const walletConnectOptions: WalletConnectOptions = {
    projectId: '<PROJECT_ID>',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: window.location.origin,
        icons: [`${window.location.origin}/images/logo/my-dapp.png`],
    },
};

const options: DAppKitOptions = {
    nodeUrl: 'https://testnet.vechain.org/',
    genesis: 'test',
    walletConnectOptions,
    usePersistence: true,
};

DAppKitUI.configure(options);
```

-   In your root `index.html`. This will add a button to your page, when clicked it will open a modal with the wallet
    connect QR code.

```html
<body>
    <vdk-connect-button-with-modal mode="DARK"></vdk-connect-button-with-modal>
</body>
```

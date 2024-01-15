# `@vechain/dapp-kit-ui`

The Vechain DApp Kit serves as a sophisticated layer built upon @vechain/connex, providing a simplified and efficient avenue for engaging with a multitude of Vechain wallets. This innovative toolkit enhances the ease of interaction, offering developers a seamless bridge to connect with diverse Vechain wallet functionalities. For more information, please refer to the official [Vechain Docs](https://docs.vechain.org/developer-resources/sdks-and-providers/dapp-kit)

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
    <vdk-button></vdk-button>
</body>
```

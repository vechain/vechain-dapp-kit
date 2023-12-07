# `@vechain/dapp-kit-ui`

-   An extension of `@vechain/connex` to containing UI components to simplify wallet connection and interaction
-   Please refer to the official documentation [here](https://docs.vechain.org/developer-resources/sdks-and-providers/dapp-kit/vanilla/installation)

---

## Installation

### Build Locally

```bash
yarn build
```

---

## Usage

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

```typescript
import type { WalletConnectOptions, DAppKitOptions } from '@vechain/dapp-kit';
import { DAppKitUI } from '@vechain/dapp-kit-ui';

//Optional
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

-   Add the following HTML. This will add a button to your page, when clicked it will open a modal with the wallet
    connect QR code:

```html
<body>
    <vwk-connect-button-with-modal mode="DARK"></vwk-connect-button-with-modal>
</body>
```

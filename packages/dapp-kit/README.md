# `@vechain/dapp-kit`

The Vechain DApp Kit serves as a sophisticated layer built upon @vechain/connex, providing a simplified and efficient avenue for engaging with a multitude of Vechain wallets. This innovative toolkit enhances the ease of interaction, offering developers a seamless bridge to connect with diverse Vechain wallet functionalities. For more information, please refer to the official [Vechain Docs](https://docs.vechain.org/developer-resources/sdks-and-providers/dapp-kit)

## Installation

```bash
yarn add @vechain/dapp-kit
```

-   Optional: Configure wallet connect options

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

-   Create a new instance of `DAppKit` and pass in the options
-   `thor` will be ready to use to interact with the chain, but calling any methods requiring a wallet will throw an
    error. See the next step to finalise the setup.

```typescript
import { DAppKit } from '@vechain/dapp-kit';

const { thor, vendor, wallet } = new DAppKit({
    nodeUrl: 'https://sync-testnet.vechain.org/', //Required
    genesis: 'main', //Optional - "main" | "test" | Connex.Thor.Block
    walletConnectOptions, //Optional
});
```

-   You can set the wallet source when the user selects a wallet, or if you want to default to a specific wallet.
-   Connex is ready to use as normal

```typescript
import type { WalletSource } from '@vechain/dapp-kit';

// type WalletSource = 'wallet-connect' | 'veworld' | 'sync2' | 'sync';
const mySource: WalletSource = 'veworld';

wallet.setSource('veworld');
```

-   Connect to the wallet. This will return the user's address
-   `verified` indicates whether a certificate is signed by the user. If a sign in is required and the account is not
    verified, you should request a subsequent certificate sign in

```typescript
const {account, verified} = await wallet.connect();

const tx = await thor.account("0x...123")
  .method(...)
  .transact()
  .signer(account)
  .request();

const certRes = await vendor.sign("cert", {...})
  .requset();
```

import { DAppKitUI } from '@vechain/dapp-kit-ui';
import { bootstrapApplication } from '@angular/platform-browser';
import type { DAppKitOptions, WalletConnectOptions } from '@vechain/dapp-kit';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
    providers: [],
    // eslint-disable-next-line no-console
}).catch((err) => console.error(err));

const walletConnectOptions: WalletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: window.location.origin,
        icons: [`${window.location.origin}/images/logo/my-dapp.png`],
    },
};

const vechainWalletKitOptions: DAppKitOptions = {
    nodeUrl: 'https://testnet.vechain.org/',
    genesis: 'test',
    walletConnectOptions,
    usePersistence: true,
};

DAppKitUI.configure(vechainWalletKitOptions);

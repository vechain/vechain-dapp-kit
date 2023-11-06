// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-undef */
import {
    VechainWalletKit,
    VechainWalletKitModal,
} from '@vechain/vanilla-wallet-kit';

const walletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: window.location.origin,
        icons: [`${window.location.origin}/images/logo/my-dapp.png`],
    },
};

const vechainWalletKitOptions = {
    node: 'https://testnet.vechain.org/',
    network: 'test',
    walletConnectOptions,
};

const walletKit = new VechainWalletKit(vechainWalletKitOptions);
const vechainWalletKit = new VechainWalletKitModal(walletKit);
vechainWalletKit.initModalListeners();

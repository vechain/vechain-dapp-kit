<script lang="ts">
import { defineComponent, provide, reactive, readonly, toRefs } from 'vue';
import {
    MultiWalletConnex,
    WalletSource,
    WalletSources,
} from '@vechain/wallet-kit';
import type Connex from '@vechain/connex';
import {
    ConnexSymbol,
    WalletActionsSymbol,
    WalletStateSymbol,
} from '@/connex/keys';
import { WalletActions, WalletState } from '@/connex/types';
import { WalletConnectOptions } from '@vechain/wallet-connect';
import { configureThorModal } from '@vechain/vanilla-wallet-kit';

const initWallets = (hasWcOptions: boolean) => {
    const wallets: WalletSource[] = ['sync2'];

    if (window.connex) {
        wallets.push('sync');
    }

    if (window.vechain) {
        wallets.push('veworld-extension');
    }

    if (hasWcOptions) {
        wallets.push('wallet-connect');
    }

    return wallets;
};

const walletConnectOptions: WalletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: window.location.origin,
        icons: [`${window.location.origin}/images/logo/my-dapp.png`],
    },
};

export default defineComponent({
    setup() {
        const walletState: WalletState = reactive<WalletState>({
            wallets: WalletSources,
            availableWallets: initWallets(true),
            source: null,
            account: null,
        });

        const onDisconnected = () => {
            walletState.account = null;
            walletState.source = null;
        };

        const connex = new MultiWalletConnex({
            nodeUrl: 'https://mainnet.vechain.org/',
            onDisconnected,
            walletConnectOptions,
        });

        configureThorModal(connex);

        const updateAccount = (addr: string) => {
            walletState.account = addr;
        };

        const updateSource = (source: WalletSource) => {
            connex.wallet.setSource(source);
            walletState.source = source;
        };

        const _connex: Connex = {
            thor: connex.thor,
            vendor: connex.vendor,
        };

        const disconnect = () => {
            connex.wallet.disconnect();
            walletState.source = null;
            walletState.account = null;
        };
        const walletActions: WalletActions = {
            updateAccount,
            updateSource,
            disconnect,
            connect: connex.wallet.connect,
        };

        provide(ConnexSymbol, readonly(_connex));
        provide(WalletStateSymbol, toRefs(readonly(walletState)));
        provide(WalletActionsSymbol, readonly(walletActions));
    },
    render() {
        return this.$slots.default?.();
    },
});
</script>

<script lang="ts">
import { defineComponent, provide, reactive, readonly, toRefs } from 'vue';
import {
    createConnexInstance,
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

        const connex = createConnexInstance({
            nodeUrl: 'https://mainnet.vechain.org/',
            onDisconnected,
        });

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

        const walletActions: WalletActions = {
            updateAccount,
            updateSource,
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

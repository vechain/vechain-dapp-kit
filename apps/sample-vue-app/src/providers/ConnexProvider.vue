<script lang="ts">
import { defineComponent, provide, reactive, readonly, toRefs } from 'vue';
import {
    createConnexInstance,
    WalletSource,
    WalletSources,
} from '@vechain/wallet-kit';
import type Connex from '@vechain/connex';
import { ConnexSymbol, WalletSymbol } from '@/providers/keys';
import { Wallet, WalletContext, WalletUpdate } from '@/providers/types';

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
        const wallet = reactive<WalletContext>({
            wallets: WalletSources,
            availableWallets: initWallets(true),
            source: null,
            account: null,
        });

        const onDisconnected = () => {
            wallet.account = null;
            wallet.source = null;
        };

        const connexInstance = createConnexInstance({
            nodeUrl: 'https://mainnet.vechain.org/',
            onDisconnected,
        });

        const updateAccount = (addr: string) => {
            wallet.account = addr;
        };

        const updateSource = (source: WalletSource) => {
            connexInstance.setSource(source);
            wallet.source = source;
        };

        const connex: Connex = {
            thor: connexInstance.thor,
            vendor: connexInstance.vendor,
        };

        const walletUpdate: WalletUpdate = {
            updateAccount,
            updateSource,
        };

        const _wallet: Wallet = {
            ...walletUpdate,
            ...wallet,
        };

        provide(ConnexSymbol, readonly(connex));
        provide(WalletSymbol, toRefs(readonly(_wallet)));
    },
    render() {
        return this.$slots?.default?.();
    },
});
</script>

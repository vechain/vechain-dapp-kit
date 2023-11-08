<script lang="ts">
import { defineComponent, provide, reactive, readonly, toRefs } from 'vue';
import {
    ConnectResponse,
    MultiWalletConnex,
    WalletSource,
} from '@vechainfoundation/wallet-kit';
import type Connex from '@vechain/connex';
import {
    ConnexSymbol,
    WalletActionsSymbol,
    WalletStateSymbol,
} from '@/connex/keys';
import { WalletActions, WalletState } from '@/connex/types';
import { WalletConnectOptions } from '@vechainfoundation/wallet-connect';
import { configureThorModal } from '@vechainfoundation/vanilla-wallet-kit';

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
            availableWallets: initWallets(!!walletConnectOptions),
            source: null,
            account: null,
        });

        const connex = new MultiWalletConnex({
            nodeUrl: 'https://mainnet.vechain.org/',
            walletConnectOptions,
        });

        const onDisconnected = () => {
            walletState.source = null;
            walletState.account = null;
        };

        const onSourceChanged = (source: WalletSource | null) => {
            walletState.source = source;
        };

        connex.wallet.onDisconnected(onDisconnected);
        connex.wallet.onSourceChanged(onSourceChanged);

        configureThorModal(connex);

        const setAccount = (addr: string) => {
            walletState.account = addr;
        };

        const setSource = (source: WalletSource) => {
            connex.wallet.setSource(source);
        };

        const connect = async (): Promise<ConnectResponse> => {
            const res = await connex.wallet.connect();
            walletState.account = res.account;
            return res;
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
            setAccount,
            setSource,
            disconnect,
            connect,
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

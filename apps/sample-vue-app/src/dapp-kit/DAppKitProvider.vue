<script lang="ts">
import { defineComponent, provide, reactive, readonly, toRefs } from 'vue';
import {
    ConnectResponse,
    WalletConnectOptions,
    WalletSource,
} from '@vechain/dapp-kit';
import type Connex from '@vechain/connex';
import {
    ConnexSymbol,
    WalletActionsSymbol,
    WalletStateSymbol,
} from '@/dapp-kit/keys';
import { WalletActions, WalletState } from '@/dapp-kit/types';
import { DAppKitUI } from '@vechain/dapp-kit-ui';

const initWallets = (hasWcOptions: boolean) => {
    const wallets: WalletSource[] = ['sync2'];

    if (window.connex) {
        wallets.push('sync');
    }

    if (window.vechain) {
        wallets.push('veworld');
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

        const dappKit = DAppKitUI.configure({
            nodeUrl: 'https://mainnet.vechain.org/',
            walletConnectOptions,
            usePersistence: true,
        });

        dappKit.wallet.subscribe((_state) => {
            walletState.account = _state.address;
            walletState.source = _state.source;
            walletState.availableWallets = _state.availableSources;
        });

        const setAccount = (addr: string) => {
            walletState.account = addr;
        };

        const setSource = (source: WalletSource) => {
            dappKit.wallet.setSource(source);
        };

        const connect = async (): Promise<ConnectResponse> => {
            const res = await dappKit.wallet.connect();
            walletState.account = res.account;
            return res;
        };

        const _connex: Connex = {
            thor: dappKit.thor,
            vendor: dappKit.vendor,
        };

        const disconnect = () => {
            dappKit.wallet.disconnect();
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

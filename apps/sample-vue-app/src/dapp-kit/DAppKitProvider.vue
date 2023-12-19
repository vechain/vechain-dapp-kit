<script lang="ts">
import { defineComponent } from 'vue';
import {
    WalletConnectOptions,
} from '@vechain/dapp-kit';
import { DAppKitUI } from '@vechain/dapp-kit-ui';


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

        DAppKitUI.configure({
            nodeUrl: 'https://mainnet.vechain.org/',
            walletConnectOptions,
            usePersistence: true,
        });

    },
    render() {
        return this.$slots.default?.();
    },
});
</script>

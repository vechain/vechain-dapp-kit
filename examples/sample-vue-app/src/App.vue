<template>
    <div class="container">
        <h2>Vue</h2>
        <div class="label">kit button:</div>
        <vdk-button></vdk-button>
        <div class="label">custom button:</div>
        <button id="custom-button" v-on:click="openModal">
            Connect Custom Button
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DAppKitUI } from '@vechain/dapp-kit-ui';
import { Genesis } from '@vechain/dapp-kit';

const walletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: window.location.origin,
        icons: [`${window.location.origin}/images/logo/my-dapp.png`],
    },
};

const vechainDAppKitOptions = {
    nodeUrl: 'https://testnet.vechain.org/',
    genesis: 'test' as Genesis,
    walletConnectOptions,
    usePersistence: true,
};

DAppKitUI.configure(vechainDAppKitOptions);

// custom button configuration

setTimeout(() => {
    const customButton = document.getElementById('custom-button');
    if (customButton) {
        customButton.addEventListener('click', async () => {
            DAppKitUI.modal.open();
        });

        const handleConnected = (address: string | null) => {
            if (address) {
                const formattedAddress = `${address.slice(
                    0,
                    6,
                )}...${address.slice(-4)}`;
                customButton.innerText = `Disconnect from ${formattedAddress}`;
            } else {
                customButton.innerText = 'Connect Custom Button';
            }
        };

        handleConnected(DAppKitUI.wallet.state.address);

        DAppKitUI.modal.onConnectionStatusChange(handleConnected);
    }
}, 100);

export default defineComponent({
    methods: {
        openModal: () => {
            DAppKitUI.modal.open();
        },
    },
});
</script>

<style>
body {
    margin: 0;
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
}
h2 {
    margin: 0;
}
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #000;
    border-radius: 20px;
    padding: 20px;
}
.label {
    margin-top: 20px;
    margin-bottom: 10px;
}
</style>

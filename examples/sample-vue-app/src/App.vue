<template>
    <div class="container">
        <h2>Vue</h2>
        <div class="label">kit button:</div>
        <vdk-button></vdk-button>
        <div class="label">custom button:</div>
        <button id="custom-button" v-on:click="openModal">
            Connect Custom Button
        </button>
        <div class="label">TX</div>
        <button v-on:click="sendTx">Send TX</button>
        <div class="label">Typed Data</div>
        <button v-on:click="signTypedData">Sign Typed Data</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DAppKitUI } from '@vechain/dapp-kit-ui';

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
    node: 'https://testnet.vechain.org/',
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
        sendTx: () => {
            DAppKitUI.signer.sendTransaction({
                clauses: [
                    {
                        to: DAppKitUI.wallet.state.address,
                       value: '01',
                        data: '0x',
                   },
                ],
                comment: 'Send 1 Wei',
            });
        },
        signTypedData: () => {
            DAppKitUI.signer.signTypedData(
                {
                    name: 'Test Data',
                    version: '1',
                   chainId: 1,
                    verifyingContract:
                        '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
                },
               { test: [{ name: 'test', type: 'address' }] },
                { test: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68' },
            );
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

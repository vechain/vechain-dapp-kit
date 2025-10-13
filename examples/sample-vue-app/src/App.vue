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
        <template v-if="!Boolean(address)">
            <button v-on:click="triggerNull">
                Trigger connection with no signature
            </button>
            <button v-on:click="triggerSignTypedData">
                Trigger connection with typed data
            </button>
            <button v-on:click="triggerCertificate">
                Trigger connection with certificate
            </button>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { DAppKitUI, DAppKitUIOptions } from '@vechain/dapp-kit-ui';
import { CertificateMessage, TypedDataMessage } from '@vechain/dapp-kit';

type OnConnectRequest = NonNullable<
    DAppKitUIOptions['v2Api']['onConnectRequest']
>;
type OnConnectResponse = NonNullable<
    DAppKitUIOptions['v2Api']['onConnectResponse']
>;

const walletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: window.location.origin,
        icons: [`${window.location.origin}/images/logo/my-dapp.png`],
    },
};

let onConnectRequest = ref<OnConnectRequest>(() => Promise.resolve(null));
let onConnectResponse = ref<OnConnectResponse>(() => Promise.resolve());
let address = ref('');

const vechainDAppKitOptions: DAppKitUIOptions = {
    node: 'https://testnet.vechain.org/',
    walletConnectOptions,
    usePersistence: true,
    v2Api: {
        enabled: true,
        onConnectRequest: (...args) => onConnectRequest.value(...args),
        onConnectResponse: (...args) => onConnectResponse.value(...args),
    },
};

DAppKitUI.configure(vechainDAppKitOptions);

// custom button configuration

setTimeout(() => {
    const customButton = document.getElementById('custom-button');
    if (customButton) {
        customButton.addEventListener('click', async () => {
            DAppKitUI.modal.open();
        });

        const handleConnected = (_address: string | null) => {
            address.value = _address ?? '';
            if (_address) {
                const formattedAddress = `${_address.slice(
                    0,
                    6,
                )}...${_address.slice(-4)}`;
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
        triggerNull: () => {
            onConnectRequest.value = () => Promise.resolve(null);
        },
        triggerCertificate: () => {
            onConnectRequest.value = () =>
                Promise.resolve({
                    payload: {
                        //<<veworld_address>> will be replaced by the user's wallet on VeWorld mobile
                        content:
                            'Test Message. Here is the user wallet: <<veworld_address>>',
                        type: 'text',
                    },
                    purpose: 'identification',
                } satisfies CertificateMessage);
        },
        triggerSignTypedData: () => {
            onConnectRequest.value = () =>
                Promise.resolve({
                    domain: {
                        name: 'Test Data',
                        version: '1',
                        chainId: 1,
                        verifyingContract:
                            '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
                    },
                    types: {
                        test: [
                            { name: 'test', type: 'address' },
                            { name: 'veworld_login_address', type: 'address' },
                        ],
                    },
                    value: {
                        test: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
                        //This will be replaced by the user's wallet on VeWorld mobile.
                        veworld_login_address:
                            '0x0000000000000000000000000000000000000000',
                    },
                } satisfies TypedDataMessage);
        },
    },
    data() {
        return {
            address,
        };
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

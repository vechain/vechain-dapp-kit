<template>
    <ConnexProvider>
        <div>
            <h2>Vue</h2>
            <vwk-button></vwk-button>
            <br />
            <button id="custom-button" v-on:click="openModal">
                Connect Custom Button
            </button>
        </div>
    </ConnexProvider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConnexProvider from '@/dapp-kit/DAppKitProvider.vue';
import { DAppKitUI } from '@vechain/dapp-kit-ui';


export default defineComponent({
    methods: {
        openModal:() => {
            DAppKitUI.modal.open();
        }
    },
    components: {
        ConnexProvider,
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
</style>

<template>
    <ConnexProvider>
        <img alt="Vue logo" src="./assets/logo.png" />
        <div id="app">
            <button class="btn" type="button" @click="showModal">
                Open Modal!
            </button>

            <ConnectWalletModal v-show="isModalVisible" @close="closeModal" />
        </div>
    </ConnexProvider>
</template>

<script lang="ts">
import ConnectWalletModal from './components/ConnectWalletModal.vue';
import { defineComponent, ref } from 'vue';
import ConnexProvider from '@/connex/ConnexProvider.vue';

export default defineComponent({
    components: {
        ConnexProvider,
        ConnectWalletModal,
    },

    setup() {
        const isModalVisible = ref(false);

        const showModal = () => {
            isModalVisible.value = true;
        };

        const closeModal = () => {
            isModalVisible.value = false;
        };

        return {
            isModalVisible,
            showModal,
            closeModal,
        };
    },
});
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>

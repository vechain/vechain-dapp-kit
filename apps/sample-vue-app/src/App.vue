<template>
    <img alt="Vue logo" src="./assets/logo.png" />
    <div id="app">
        <button class="btn" type="button" @click="showModal">
            Open Modal!
        </button>

        <ConnectWalletModal v-show="isModalVisible" @close="closeModal" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ConnectWalletModal from './components/ConnectWalletModal.vue';
import { WalletSource } from '@vechain/wallet-kit';

@Options({
    components: {
        ConnectWalletModal,
    },
})
export default class App extends Vue {
    isModalVisible = false;

    showModal(source: WalletSource) {
        console.log(`Connect function called with ID: ${source}`);
        this.isModalVisible = true;
    }

    closeModal() {
        this.isModalVisible = false;
    }
}
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

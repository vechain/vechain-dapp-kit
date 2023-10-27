<template>
    <div id="app">
        <button class="btn" type="button" @click="showModal">
            Open Modal!
        </button>

        <ConnectWalletModal v-show="isModalVisible" @close="closeModal" />
    </div>
</template>

<script>
import ConnectWalletModal from './components/ConnectWalletModal.vue';

export default {
    name: 'App',
    components: {
        ConnectWalletModal,
    },
    data() {
        return {
            isModalVisible: false,
        };
    },
    methods: {
        showModal() {
            this.isModalVisible = true;
        },
        closeModal() {
            this.isModalVisible = false;
        },
    },
};
</script>

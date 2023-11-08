<template>
    <ConnexProvider>
        <img alt="Vue logo" src="./assets/logo.png" />
        <div id="app">
            <vwk-connect-button-with-modal
                mode="DARK"
            ></vwk-connect-button-with-modal>
        </div>
    </ConnexProvider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConnexProvider from '@/connex/ConnexProvider.vue';

export default defineComponent({
    components: {
        ConnexProvider,
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

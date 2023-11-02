<template>
    <transition name="modal-fade">
        <div class="modal-backdrop">
            <div
                aria-describedby="modalDescription"
                aria-labelledby="modalTitle"
                class="modal"
                role="dialog"
            >
                <header id="modalTitle" class="modal-header">
                    <slot name="header">Connect Wallet</slot>
                    <button class="btn-close" @click="close">×</button>
                </header>

                <section id="modalDescription" class="modal-body">
                    <slot name="current">{{ account }}</slot>
                    <br />
                    <slot name="current">{{ source }}</slot>

                    <ul class="radio-list">
                        <li>
                            <input
                                id="sync2"
                                v-model="source"
                                type="radio"
                                value="sync2"
                                @change="connectWallet('sync2')"
                            />
                            <label for="sync2">Sync2</label>
                        </li>
                        <li>
                            <input
                                id="veworld-extension"
                                v-model="source"
                                type="radio"
                                value="veworld-extension"
                                @change="connectWallet('veworld-extension')"
                            />
                            <label for="veworld-extension">VeWorld</label>
                        </li>
                        <li>
                            <input
                                id="wallet-connect"
                                v-model="source"
                                type="radio"
                                value="wallet-connect"
                                @change="connectWallet('wallet-connect')"
                            />
                            <label for="wallet-connect">Wallet Connect</label>
                        </li>
                    </ul>
                </section>

                <!-- Footer Section -->
                <footer class="modal-footer">
                    <button class="disconnect-button" @click="disconnect">
                        Disconnect
                    </button>
                </footer>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import type { WalletSource } from '@vechain/wallet-kit';
import { defineComponent } from 'vue';
import { injectWalletActions, injectWalletState } from '@/connex/injections';

export default defineComponent({
    setup() {
        const { source, account } = injectWalletState();
        const { updateSource, updateAccount, connect, disconnect } =
            injectWalletActions();

        return {
            connect,
            disconnect,
            account,
            source,
            updateSource,
            updateAccount,
        };
    },

    watch: {
        source: {
            immediate: true,
            async handler(source: WalletSource | null) {
                if (source) {
                    const res = await this.connect();

                    this.updateAccount(res.account);
                }
            },
        },
    },

    emits: ['close'],

    methods: {
        close() {
            this.$emit('close');
        },

        async connectWallet(source: WalletSource) {
            if (source !== this.source) {
                this.disconnect();
            }

            this.updateSource(source);
        },
    },
});
</script>

<style>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 500px; /* Adjust the width as needed */
    border-radius: 10px;
    overflow: hidden;
}

.modal-header {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #4aae9b;
    color: white;
    border-bottom: 1px solid #4aae9b;
    border-radius: 10px 10px 0 0;
}

.modal-body {
    padding: 20px;
}

.btn-close {
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: white;
    background: transparent;
}

.btn-close:hover {
    color: #4aae9b;
}

.radio-list {
    list-style: none; /* Remove bullet points */
    padding: 0;
}

.radio-list li {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

.radio-list input[type='radio'] {
    margin-right: 10px;
}

.radio-list label {
    font-size: 18px;
    color: #333;
    cursor: pointer;
}

.modal-footer {
    padding: 15px;
    display: flex;
    justify-content: flex-end; /* Adjust alignment as needed */
    background-color: #4aae9b;
    border-radius: 0 0 10px 10px;
}

.modal-footer button {
    /* Style your footer button here */
    background-color: #4aae9b;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

.modal-footer button:hover {
    background-color: #357a72;
}

.disconnect-button {
    /* Style for the Disconnect button */
    background-color: #e74c3c;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 20px; /* Rounded border */
    transition: background-color 0.3s; /* Smooth color transition on hover */
}

.disconnect-button:hover {
    background-color: #c0392b;
}
</style>

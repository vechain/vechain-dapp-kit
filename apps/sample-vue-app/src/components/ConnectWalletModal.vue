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
                    <slot name="current">{{ source }}</slot>

                    <ul>
                        <li>
                            <button @click="connect('sync2')">Sync2</button>
                        </li>

                        <li>
                            <button @click="connect('veworld-extension')">
                                VeWorld
                            </button>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import type { WalletSource } from '@vechain/wallet-kit';
import { defineComponent } from 'vue';
import { injectConnex, injectWallet } from '@/providers/injections';

export default defineComponent({
    setup() {
        const { vendor } = injectConnex();
        const { source, account, updateSource, updateAccount } = injectWallet();

        return {
            vendor,
            account,
            source,
            updateSource,
            updateAccount,
        };
    },

    watch: {
        wallet(val) {
            if (val) {
                this.close();
            }
        },
    },

    emits: ['close'],

    methods: {
        close() {
            this.$emit('close');
        },

        async connect(source: WalletSource) {
            this.updateSource(source);

            const res = await this.vendor
                .sign('cert', {
                    purpose: 'identification',
                    payload: {
                        content: 'Hello World!',
                        type: 'text',
                    },
                })
                .request();

            this.updateAccount(res.annex.signer);
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
</style>

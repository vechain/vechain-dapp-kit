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
                    <ul>
                        <li>
                            <button @click="connect('walletConnect')">
                                Wallet Connect
                            </button>
                        </li>

                        <li>
                            <button @click="connect('veWorld')">VeWorld</button>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'ConnectWalletModal',
    methods: {
        close() {
            this.$emit('close');
        },

        connect(id) {
            console.log(`Connect function called with ID: ${id}`);
        },
    },
};
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

.modal-header,
.modal-footer {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #4aae9b;
    color: white;
    border-bottom: 1px solid #4aae9b;
    border-radius: 10px 10px 0 0;
}

.modal-footer {
    border-top: 1px solid #4aae9b;
    border-radius: 0 0 10px 10px;
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

.btn-green {
    color: white;
    background: #4aae9b;
    border: none;
    border-radius: 2px;
    padding: 10px 20px;
    cursor: pointer;
}

.modal-fade-enter,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.5s ease;
}
</style>

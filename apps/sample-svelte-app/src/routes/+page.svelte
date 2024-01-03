<script>
    import '$lib';
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

    const vechainWalletKitOptions = {
        nodeUrl: 'https://testnet.vechain.org/',
        genesis: 'test',
        walletConnectOptions,
        usePersistence: true,
    };

    DAppKitUI.configure(vechainWalletKitOptions);
</script>

<div>
    <h2>Svelte</h2>
    <vwk-button></vwk-button>
    <br />
    <button on:click={DAppKitUI.modal.open}>Connect Custom Button</button>
</div>

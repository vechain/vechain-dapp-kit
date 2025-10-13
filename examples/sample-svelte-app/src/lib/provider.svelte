<script lang="ts">
    import { DAppKitUI } from '@vechain/dapp-kit-ui';
    import {
        setDappKitFunctionsContext,
        type DappKitFunctionsContextProps,
    } from './provider';
    import { walletConnectOptions } from './wc';

    let { children } = $props();

    let context = $state<DappKitFunctionsContextProps>({
        onConnectRequest: () => Promise.resolve(null),
        onConnectResponse: () => Promise.resolve(),
        dappKit: null,
    });

    $effect(() => {
        context.dappKit = DAppKitUI.configure({
            node: 'https://testnet.vechain.org/',
            walletConnectOptions,
            usePersistence: true,
            v2Api: {
                enabled: true,
                onConnectRequest: (...args) =>
                    context.onConnectRequest(...args),
                onConnectResponse: (...args) =>
                    context.onConnectResponse(...args),
            },
        });
        context.dappKit.initialize();
    });

    setDappKitFunctionsContext(context);
</script>

{@render children()}

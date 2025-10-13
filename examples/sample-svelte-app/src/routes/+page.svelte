<script lang="ts">
    import { getDappKitFunctionsContext } from '$lib/provider';
    import type {
        CertificateMessage,
        TypedDataMessage,
    } from '@vechain/dapp-kit';
    import { DAppKitUI } from '@vechain/dapp-kit-ui';

    const ctx = getDappKitFunctionsContext();
    let address = $state('');

    const openModal = () => {
        DAppKitUI.modal.open();
    };

    const sendTx = () =>
        DAppKitUI.signer?.sendTransaction({
            clauses: [
                {
                    to: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
                    value: '0x1',
                    data: '0x',
                },
            ],
            comment: 'Send 1 Wei',
        });

    const signTypedData = () =>
        DAppKitUI.signer?.signTypedData(
            {
                name: 'Test Data',
                version: '1',
                chainId: 1,
                verifyingContract: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
            },
            { test: [{ name: 'test', type: 'address' }] },
            { test: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68' },
        );

    const triggerCertificate = () => {
        ctx.onConnectRequest = () =>
            Promise.resolve({
                payload: {
                    //<<veworld_address>> will be replaced by the user's wallet on VeWorld mobile
                    content:
                        'Test Message. Here is the user wallet: <<veworld_address>>',
                    type: 'text',
                },
                purpose: 'identification',
            } satisfies CertificateMessage);
    };

    const triggerNull = () => {
        ctx.onConnectRequest = () => Promise.resolve(null);
    };

    const triggerSignTypedData = () => {
        ctx.onConnectRequest = () =>
            Promise.resolve({
                domain: {
                    name: 'Test Data',
                    version: '1',
                    chainId: 1,
                    verifyingContract:
                        '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
                },
                types: {
                    test: [
                        { name: 'test', type: 'address' },
                        { name: 'veworld_login_address', type: 'address' },
                    ],
                },
                value: {
                    test: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
                    //This will be replaced by the user's wallet on VeWorld mobile.
                    veworld_login_address:
                        '0x0000000000000000000000000000000000000000',
                },
            } satisfies TypedDataMessage);
    };

    $effect(() => {
        if (!DAppKitUI.initialized) return;
        DAppKitUI.modal.onConnectionStatusChange((_address) => {
            address = address;
        });
    });
</script>

<div class="container">
    <h2>Svelte</h2>
    <div class="label">kit button:</div>
    <vdk-button></vdk-button>
    <div class="label">custom button:</div>
    <button id="custom-button" onclick={openModal}>
        {#if address}
            {@const formattedAddress = `${address.slice(
                0,
                6,
            )}...${address.slice(-4)}`}
            Disconnect from {formattedAddress}
        {:else}
            Connect Custom Button
        {/if}
    </button>
    <div class="label">TX</div>
    <button id="send-tx-button" onclick={sendTx}>Send TX</button>
    <div class="label">Typed Data</div>
    <button id="sign-typed-data-button" onclick={signTypedData}
        >Sign Typed Data</button
    >
    {#if !address}
        <button onclick={triggerNull}>
            Trigger connection with no signature
        </button>
        <button onclick={triggerSignTypedData}>
            Trigger connection with typed data
        </button>
        <button onclick={triggerCertificate}>
            Trigger connection with certificate
        </button>
    {/if}
</div>

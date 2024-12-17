'use client';

import { type ReactElement, useMemo, useCallback } from 'react';
import { Button } from '@chakra-ui/react';
import {
    useWallet,
    useSendTransaction,
    ConnectButton,
    //AbstractAccountSigner,
    //usePrivy,
} from '@vechain/dapp-kit-react-privy';
//import { useWallets, type ConnectedWallet } from '@privy-io/react-auth';
import { b3trAbi, b3trMainnetAddress } from '../constants';
//import { ThorClient, VeChainProvider } from '@vechain/sdk-network';

const HomePage = (): ReactElement => {
    const {
        isConnected,
        connectedAccount,
        smartAccount,
        isLoadingConnection,
        connectionType,
        //privyEmbeddedWallet
    } = useWallet();

    // A dummy tx sending 0 b3tr tokens
    const clauses = useMemo(() => {
        if (!connectedAccount) return [];

        const clausesArray: any[] = [];
        clausesArray.push({
            to: b3trMainnetAddress,
            value: '0x0',
            data: b3trAbi.encodeFunctionData('transfer', [
                connectedAccount,
                '0', // 1 B3TR (in wei)
            ]),
            comment: `Transfer ${1} B3TR to `,
            abi: b3trAbi.getFunction('transfer'),
        });
        return clausesArray;
    }, [connectedAccount]);

    const {
        sendTransaction,
        status,
        txReceipt,
        resetStatus,
        isTransactionPending,
    } = useSendTransaction({
        signerAccount: smartAccount.address,
        privyUIOptions: {
            title: 'Sign to confirm',
            description:
                'This is a test transaction performing a transfer of 1 B3TR tokens from your smart account.',
            buttonText: 'Sign',
        },
    });

    const handleTransaction = useCallback(async () => {
        await sendTransaction(clauses);
    }, [sendTransaction, clauses]);

    /*const { signTypedData } = usePrivy();
    const { wallets } = useWallets();

    const embeddedWallet = useMemo<ConnectedWallet | undefined>(() => {
        return wallets.find((wallet) => wallet.walletClientType === 'privy');
    }, [wallets]);
    const THOR_CLIENT = ThorClient.at('https://mainnet.vechain.org');
    const signer = new AbstractAccountSigner(
        signTypedData,
        embeddedWallet!,
        new VeChainProvider(THOR_CLIENT),
    );

    const testSigner = async () => {
        signer.sendTransaction({
            clauses: [
                {
                    to: b3trMainnetAddress,
                    value: '0x0',
                    data: b3trAbi.encodeFunctionData('transfer', [
                        connectedAccount,
                        '0', // 1 B3TR (in wei)
                    ]),
                    comment: `Transfer ${1} B3TR to `,
                },
            ],
        });
    };*/

    return (
        <div className="container">
            <ConnectButton />
            {isLoadingConnection ? (
                <p>Loading...</p>
            ) : (
                <>
                    {isConnected && (
                        <div>
                            <h1>
                                <b>Wallet</b>
                            </h1>
                            <p>Connected Address: {connectedAccount}</p>
                            {<p>Connection Type: {connectionType}</p>}
                            <br />

                            <h1>
                                <b>Smart Account</b>
                            </h1>
                            <p>Smart Account: {smartAccount.address}</p>
                            <p>
                                Deployed: {smartAccount.isDeployed.toString()}
                            </p>
                            <br />
                            <br />
                            <h1>
                                <b>Actions</b>
                            </h1>
                            <br />
                            <Button
                                onClick={handleTransaction}
                                isLoading={isTransactionPending}
                                isDisabled={isTransactionPending}
                            >
                                Test Tx
                            </Button>

                            {/*<Button onClick={testSigner}>Test SDK Signer</Button>*/}

                            {status !== 'ready' && (
                                <>
                                    <p>Status: {status}</p>
                                    {txReceipt && (
                                        <>
                                            <p>Tx id: {txReceipt.meta.txID}</p>
                                            <Button onClick={resetStatus}>
                                                Reset
                                            </Button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage;

'use client';

import { type ReactElement, useMemo, useCallback } from 'react';
import { Button, Text } from '@chakra-ui/react';
import {
    useWallet,
    useSendTransaction,
    ConnectButton,
} from '@vechain/dapp-kit-react-privy';
import { b3trAbi, b3trMainnetAddress } from '../constants';

const HomePage = (): ReactElement => {
    const {
        isConnected,
        connectedAccount,
        smartAccount,
        isLoadingConnection,
        connectionType,
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
                            <p>Address: {connectedAccount}</p>
                            {<p>Connection Type: {connectionType}</p>}
                            <br />
                            {smartAccount.address && (
                                <>
                                    <h1>
                                        <b>Smart Account</b>
                                    </h1>
                                    <p>Smart Account: {smartAccount.address}</p>
                                    <p>
                                        Deployed:{' '}
                                        {smartAccount.isDeployed.toString()}
                                    </p>
                                    <br />
                                    <br />
                                </>
                            )}

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
                            {status !== 'ready' && (
                                <>
                                    <Text>Status: {status}</Text>
                                    {txReceipt && (
                                        <Text>
                                            Tx id: {txReceipt.meta.txID}
                                        </Text>
                                    )}
                                    <Button
                                        variant={'link'}
                                        onClick={resetStatus}
                                    >
                                        Reset
                                    </Button>
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

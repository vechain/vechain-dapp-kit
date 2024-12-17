'use client';

import { type ReactElement, useMemo, useCallback } from 'react';
import { useDisclosure, Button } from '@chakra-ui/react';
import {
    useWallet,
    ConnectModal,
    useSendTransaction,
} from '@vechain/dapp-kit-react-privy';
import { b3trAbi, b3trMainnetAddress } from '../constants';

const HomePage = (): ReactElement => {
    const {
        isConnected,
        connectedAccount,
        smartAccount,
        logoutAndDisconnect,
        isLoadingConnection,
        connectionType,
    } = useWallet();

    const {
        isOpen: isLoginOpen,
        onOpen: onLoginOpen,
        onClose: onLoginClose,
    } = useDisclosure();

    // A dummy tx sending 0 b3tr tokens
    const clauses = useMemo(() => {
        const clausesArray: any[] = [];
        clausesArray.push({
            to: b3trMainnetAddress,
            value: '0x0',
            data: b3trAbi.encodeFunctionData('transfer', [
                connectedAccount,
                '1000000000000000000', // 1 B3TR (in wei)
            ]),
            comment: `Transfer ${1} B3TR to `,
            abi: b3trAbi.getFunction('transfer'),
        });
        return clausesArray;
    }, []);

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
            {isLoadingConnection ? (
                <p>Loading...</p>
            ) : (
                <>
                    {isConnected ? (
                        <Button onClick={logoutAndDisconnect}>Logout</Button>
                    ) : (
                        <Button onClick={onLoginOpen}>Login</Button>
                    )}

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

                    <ConnectModal
                        isOpen={isLoginOpen}
                        onClose={onLoginClose}
                        logo={'https://i.ibb.co/ZHGmq3y/image-21.png'}
                    />
                </>
            )}
        </div>
    );
};

export default HomePage;

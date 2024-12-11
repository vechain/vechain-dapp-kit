'use client';

import { type ReactElement, useMemo, useCallback } from 'react';
import { useDisclosure, Button } from '@chakra-ui/react';
import {
    useWallet,
    ConnectModal,
    useSendTransaction,
} from '@vechain/dapp-kit-react-privy';
import { b3trAbi } from '../constants';

const HomePage = (): ReactElement => {
    const {
        isConnected,
        isConnectedWithPrivy,
        isConnectedWithDappKit,
        connectedAddress,
        smartAccount,
        logoutAndDisconnect,
        isLoadingConnection,
        isCrossAppPrivyAccount,
    } = useWallet();

    const {
        isOpen: isLoginOpen,
        onOpen: onLoginOpen,
        onClose: onLoginClose,
    } = useDisclosure();

    // A dummy tx sending 0 b3tr tokens
    const clauses = useMemo(() => {
        if (!connectedAddress) return [];

        const clausesArray: any[] = [];
        clausesArray.push({
            to: connectedAddress,
            value: '0x0',
            data: b3trAbi.encodeFunctionData('transfer', [
                connectedAddress,
                String(0),
            ]),
            comment: `Transfer ${0} B3TR to staking pool`,
            abi: b3trAbi.getFunction('transfer'),
        });
        return clausesArray;
    }, [connectedAddress]);

    const {
        sendTransaction,
        status,
        txReceipt,
        resetStatus,
        isTransactionPending,
    } = useSendTransaction({
        signerAccount: smartAccount.address,
        privyUIOptions: {
            title: 'Test Transaction',
            description:
                'This is a test transaction performing a transfer of 0 B3TR tokens from your smart account.',
            buttonText: 'Sign and execute',
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
                        <Button onClick={logoutAndDisconnect}>
                            Disconnect
                        </Button>
                    ) : (
                        <Button onClick={onLoginOpen}>Connect</Button>
                    )}

                    {isConnected && (
                        <div>
                            <p>Connected Address: {connectedAddress}</p>
                            <p>
                                Connected with Privy:{' '}
                                {isConnectedWithPrivy.toString()}
                            </p>
                            {isConnectedWithPrivy && (
                                <p>
                                    Cross App Connection:{' '}
                                    {isCrossAppPrivyAccount.toString()}
                                </p>
                            )}
                            <p>
                                Connected with DappKit:{' '}
                                {isConnectedWithDappKit.toString()}
                            </p>
                            <p>Smart Account: {smartAccount.address}</p>
                            <p>
                                Smart Account Deployed:{' '}
                                {smartAccount.isDeployed.toString()}
                            </p>
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
                                        <p>Tx id: {txReceipt.meta.txID}</p>
                                    )}
                                </>
                            )}
                            {status === 'success' ||
                                (status === 'error' && (
                                    <Button onClick={resetStatus}>Reset</Button>
                                ))}
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

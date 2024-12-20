'use client';

import { type ReactElement, useMemo, useCallback } from 'react';
import {
    Button,
    Container,
    Heading,
    HStack,
    Stack,
    Text,
    useColorMode,
    useDisclosure,
    VStack,
    Box,
    Spinner,
} from '@chakra-ui/react';
import {
    useWallet,
    useSendTransaction,
    WalletButton,
    TransactionModal,
    TransactionToast,
    useDAppKitPrivyColorMode,
} from '@vechain/dapp-kit-react-privy';
import { b3trAbi, b3trMainnetAddress } from '../constants';
import { Interface } from 'ethers';

const HomePage = (): ReactElement => {
    const { toggleColorMode, colorMode } = useColorMode();
    const { toggleColorMode: toggleDAppKitPrivyColorMode } =
        useDAppKitPrivyColorMode();

    const { connection, smartAccount, connectedWallet } = useWallet();

    // A dummy tx sending 0 b3tr tokens
    const clauses = useMemo(() => {
        if (!connectedWallet.address) return [];

        const clausesArray: any[] = [];
        const abi = new Interface(b3trAbi);
        clausesArray.push({
            to: b3trMainnetAddress,
            value: '0x0',
            data: abi.encodeFunctionData('transfer', [
                connectedWallet.address,
                '0', // 1 B3TR (in wei)
            ]),
            comment: `Transfer ${1} B3TR to `,
            abi: abi.getFunction('transfer'),
        });
        return clausesArray;
    }, [connectedWallet.address]);

    const {
        sendTransaction,
        status,
        txReceipt,
        resetStatus,
        isTransactionPending,
        error,
    } = useSendTransaction({
        signerAccount: smartAccount,
        privyUIOptions: {
            title: 'Sign to confirm',
            description:
                'This is a test transaction performing a transfer of 1 B3TR tokens from your smart account.',
            buttonText: 'Sign',
        },
    });

    const transactionToast = useDisclosure();
    const handleTransactionWithToast = useCallback(async () => {
        transactionToast.onOpen();
        await sendTransaction(clauses);
    }, [sendTransaction, clauses]);

    const transactionModal = useDisclosure();
    const handleTransactionWithModal = useCallback(async () => {
        transactionModal.onOpen();
        await sendTransaction(clauses);
    }, [sendTransaction, clauses]);

    if (connection.isLoadingPrivyConnection) {
        return (
            <Container>
                <HStack justifyContent={'center'}>
                    <Spinner />
                </HStack>
            </Container>
        );
    }

    if (!connection.isConnected) {
        return (
            <Container>
                <HStack justifyContent={'center'}>
                    <WalletButton />
                </HStack>
            </Container>
        );
    }

    return (
        <Container>
            <HStack justifyContent={'space-between'}>
                <WalletButton />

                <Button
                    onClick={() => {
                        toggleDAppKitPrivyColorMode();
                        toggleColorMode();
                    }}
                >
                    {colorMode === 'dark' ? 'Light' : 'Dark'}
                </Button>
            </HStack>

            <Stack
                mt={10}
                overflowWrap={'break-word'}
                wordBreak={'break-word'}
                whiteSpace={'normal'}
            >
                <VStack spacing={4} alignItems="flex-start">
                    {smartAccount.address && (
                        <Box mt={4}>
                            <Heading size={'md'}>
                                <b>Smart Account</b>
                            </Heading>
                            <Text>Smart Account: {smartAccount.address}</Text>
                            <Text>
                                Deployed: {smartAccount.isDeployed.toString()}
                            </Text>
                            <Text>Owner: {smartAccount.owner}</Text>
                        </Box>
                    )}

                    <Box>
                        <Heading size={'md'}>
                            <b>Wallet</b>
                        </Heading>
                        <Text>Address: {connectedWallet?.address}</Text>
                        <Text>Connection Type: {connection.source.type}</Text>
                    </Box>

                    <Box mt={4}>
                        <Heading size={'md'}>
                            <b>Actions</b>
                        </Heading>
                        <HStack mt={4} spacing={4}>
                            <HStack mt={4} spacing={4}>
                                <Button
                                    onClick={handleTransactionWithToast}
                                    isLoading={isTransactionPending}
                                    isDisabled={isTransactionPending}
                                >
                                    Test Tx with toast
                                </Button>
                                <Button
                                    onClick={handleTransactionWithModal}
                                    isLoading={isTransactionPending}
                                    isDisabled={isTransactionPending}
                                >
                                    Test Tx with modal
                                </Button>
                            </HStack>
                        </HStack>
                    </Box>
                </VStack>
            </Stack>

            <TransactionToast
                isOpen={transactionToast.isOpen}
                onClose={transactionToast.onClose}
                status={status}
                error={error}
                txReceipt={txReceipt}
                resetStatus={resetStatus}
            />

            <TransactionModal
                isOpen={transactionModal.isOpen}
                onClose={transactionModal.onClose}
                status={status}
                txId={txReceipt?.meta.txID}
                errorDescription={error?.reason ?? 'Unknown error'}
                showSocialButtons={true}
                showExplorerButton={true}
            />
        </Container>
    );
};

export default HomePage;

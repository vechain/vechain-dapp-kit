import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Spinner,
    Text,
    VStack,
} from '@chakra-ui/react';
import { LinkIcon, WalletIcon } from '@heroicons/react/24/solid';
import React, { useCallback, useState } from 'react';
import { useWallet } from '../../ConnexProvider';
import { Dialog } from './Dialog';
import { WalletSourceRadio } from './WalletSourceRadio';

interface ConnectedWalletDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ConnectWalletModal: React.FC<ConnectedWalletDialogProps> = ({
    isOpen,
    onClose,
}) => {
    const header = (
        <HStack spacing={2}>
            <Icon as={WalletIcon} />
            <Text>Connect Wallet</Text>
        </HStack>
    );

    return (
        <Dialog
            body={<ConnectedWalletBody onClose={onClose} />}
            header={header}
            isOpen={isOpen}
            onClose={onClose}
        />
    );
};

interface ConnectedWalletBodyProps {
    onClose: () => void;
}

const ConnectedWalletBody: React.FC<ConnectedWalletBodyProps> = ({
    onClose,
}) => {
    const { setAccount, connect } = useWallet();

    const [connectionLoading, setConnectionLoading] = useState(false);
    const [connectionError, setConnectionError] = useState('');

    const connectHandler = useCallback(async () => {
        try {
            setConnectionError('');
            setConnectionLoading(true);

            const { account } = await connect();

            setAccount(account);
            onClose();
        } catch (e) {
            if (e instanceof Error) {
                setConnectionError(e.message);
            } else {
                setConnectionError('Failed to connect to wallet');
            }
        } finally {
            setConnectionLoading(false);
        }
    }, [
        connect,
        onClose,
        setAccount,
        setConnectionError,
        setConnectionLoading,
    ]);

    const _connect = useCallback(() => {
        connectHandler().catch(() => {
            // do nothing
        });
    }, [connectHandler]);

    return (
        <>
            <Flex direction="column" gap={8}>
                <Box>
                    <Text mb="8px">Wallet</Text>
                    <WalletSourceRadio />
                </Box>
            </Flex>
            <VStack mt={8} spacing={4} w="full">
                {connectionLoading ? (
                    <Alert status="warning">
                        <AlertIcon />
                        Waiting for wallet approval...
                    </Alert>
                ) : null}
                {connectionError ? (
                    <Alert status="error">
                        <AlertIcon />
                        {connectionError}
                    </Alert>
                ) : null}

                <Button
                    colorScheme="blue"
                    disabled={connectionLoading}
                    leftIcon={
                        connectionLoading ? <Spinner /> : <Icon as={LinkIcon} />
                    }
                    onClick={_connect}
                    w="full"
                >
                    {connectionLoading ? 'Connecting...' : 'Connect'}
                </Button>
            </VStack>
        </>
    );
};

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
    useToast,
    VStack,
} from '@chakra-ui/react';
import { LinkIcon, WalletIcon } from '@heroicons/react/24/solid';
import React, { useCallback, useState } from 'react';
import { Certificate } from 'thor-devkit';
import { useConnex, useWallet } from '../../ConnexProvider';
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
    const toast = useToast();
    const { setAccount } = useWallet();
    const { vendor } = useConnex();

    const [connectionLoading, setConnectionLoading] = useState(false);
    const [connectionError, setConnectionError] = useState('');

    const connectToWalletHandler =
        useCallback(async (): Promise<Certificate> => {
            const message: Connex.Vendor.CertMessage = {
                purpose: 'identification',
                payload: {
                    type: 'text',
                    content: 'Sign a certificate to prove your identity',
                },
            };

            if (!vendor) throw new Error('Vendor not available');

            const certResponse = await vendor.sign('cert', message).request();

            const cert: Certificate = {
                purpose: message.purpose,
                payload: message.payload,
                domain: certResponse.annex.domain,
                timestamp: certResponse.annex.timestamp,
                signer: certResponse.annex.signer,
                signature: certResponse.signature,
            };

            Certificate.verify(cert);

            return cert;
        }, [vendor]);

    const onSuccessfullConnection = useCallback(
        (cert: Certificate): void => {
            setAccount(cert.signer);
            onClose();
            toast({
                title: 'Wallet connected.',
                description: `You've succesfully connected with wallet ${cert.signer}`,
                status: 'success',
                position: 'bottom-left',
                duration: 5000,
                isClosable: true,
            });
        },
        [toast, setAccount, onClose],
    );

    const connectHandler = useCallback(async () => {
        try {
            setConnectionError('');
            setConnectionLoading(true);

            const cert = await connectToWalletHandler();

            onSuccessfullConnection(cert);
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
        onSuccessfullConnection,
        setConnectionError,
        setConnectionLoading,
        connectToWalletHandler,
    ]);

    const connect = useCallback(() => {
        connectHandler().catch((e) => {
            throw e;
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
                    onClick={connect}
                    w="full"
                >
                    {connectionLoading ? 'Connecting...' : 'Connect'}
                </Button>
            </VStack>
        </>
    );
};

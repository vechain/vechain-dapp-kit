import {
    Box,
    VStack,
    Text,
    Link,
    Icon,
    HStack,
    Heading,
    Spinner,
    useColorMode,
    Button,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useSmartAccount } from '../../hooks';
import { EXPLORER_URL, TransactionStatusErrorType } from '../../utils';
import { FcCheckmark } from 'react-icons/fc';
import { IoOpenOutline } from 'react-icons/io5';
import { MdOutlineErrorOutline } from 'react-icons/md';

export type TransactionToastProps = {
    isOpen: boolean;
    onClose: () => void;
    status: string;
    txReceipt: any;
    resetStatus: () => void;
    error?: TransactionStatusErrorType;
};

type StatusConfig = {
    icon: React.ReactElement;
    title: string;
    closeDisabled: boolean;
};

export const TransactionToast = ({
    isOpen,
    onClose,
    status,
    txReceipt,
    error,
    resetStatus,
}: TransactionToastProps) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { chainId } = useSmartAccount();
    const explorerUrl = EXPLORER_URL[chainId as keyof typeof EXPLORER_URL];

    const statusConfig: Record<string, StatusConfig> = {
        pending: {
            icon: <Spinner size="md" />,
            title: 'Processing transaction...',
            closeDisabled: true,
        },
        waitingConfirmation: {
            icon: <Spinner size="md" />,
            title: 'Processing transaction...',
            closeDisabled: true,
        },
        error: {
            icon: (
                <Icon
                    as={MdOutlineErrorOutline}
                    color={'red'}
                    fontSize={'40px'}
                />
            ),
            title: 'Transaction failed',
            closeDisabled: false,
        },
        success: {
            icon: <Icon as={FcCheckmark} fontSize={'40px'} />,
            title: 'Transaction successful!',
            closeDisabled: false,
        },
    };

    const handleClose = () => {
        onClose();
        resetStatus();
    };

    const toastContent = useMemo(() => {
        const config = statusConfig[status];
        if (!config) return null;

        return (
            <HStack
                spacing={4}
                w={'full'}
                justifyContent={'flex-start'}
                alignItems={'center'}
            >
                {config.icon}

                <VStack w={'full'} align={'flex-start'} spacing={2}>
                    <Heading size={'xs'}>{config.title}</Heading>

                    {error && <Text fontSize={'xs'}>{error.reason}</Text>}

                    {txReceipt && status !== 'pending' && (
                        <Link
                            fontSize={'xs'}
                            isExternal
                            href={`${explorerUrl}/${txReceipt.meta.txID}`}
                        >
                            View on explorer <Icon as={IoOpenOutline} />
                        </Link>
                    )}
                </VStack>
            </HStack>
        );
    }, [status, txReceipt, explorerUrl, error]);

    if (!toastContent || !isOpen) return null;

    return (
        <Box
            position="fixed"
            bottom="10"
            left="10"
            zIndex="11111"
            bg={isDark ? '#1f1f1e' : 'white'}
            borderRadius={'md'}
            p={5}
            boxShadow="lg"
            maxW="sm"
        >
            <HStack justify="space-between" alignItems={'center'} w="full">
                <VStack spacing={4}>{toastContent}</VStack>
                {!statusConfig[status].closeDisabled && (
                    <Button
                        onClick={handleClose}
                        variant="ghost"
                        size="sm"
                        borderRadius={'full'}
                        aria-label="Close"
                        ml={5}
                    >
                        Close
                    </Button>
                )}
            </HStack>
        </Box>
    );
};

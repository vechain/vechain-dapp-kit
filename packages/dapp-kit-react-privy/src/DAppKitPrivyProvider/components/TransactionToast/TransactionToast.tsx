import {
    Modal,
    ModalContent,
    VStack,
    Text,
    Link,
    ModalCloseButton,
    ModalBody,
    Spinner,
    Icon,
    HStack,
    Heading,
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
            closeDisabled: false,
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

    if (!toastContent) return null;

    return (
        <Modal
            size={'sm'}
            motionPreset="slideInBottom"
            onClose={handleClose}
            isOpen={isOpen}
            blockScrollOnMount={false}
            variant={'transactionToast'}
            closeOnOverlayClick={false}
            closeOnEsc={false}
            trapFocus={false}
            allowPinchZoom={false}
        >
            <ModalContent>
                <ModalCloseButton
                    onClick={handleClose}
                    isDisabled={statusConfig[status].closeDisabled}
                    fontSize={'10px'}
                />
                <ModalBody>
                    <VStack spacing={4}>{toastContent}</VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

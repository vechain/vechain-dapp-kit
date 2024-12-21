import { Heading, VStack, Text, Spinner } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useWallet } from '../../../hooks';

export type ConfirmationModalContentProps = {
    title?: ReactNode;
};

export const ConfirmationModalContent = ({
    title = 'Waiting for confirmation',
}: ConfirmationModalContentProps) => {
    const { isConnectedWithPrivy } = useWallet();
    return (
        <VStack align={'center'} p={6} gap={6}>
            <Heading size="md">{title}</Heading>

            <Spinner my={10} size="xl" />

            <Text fontSize="sm" align={'center'}>
                {isConnectedWithPrivy
                    ? 'Please do not close this window, it will take just a few seconds.'
                    : 'Please confirm the transaction in your wallet.'}
            </Text>
        </VStack>
    );
};

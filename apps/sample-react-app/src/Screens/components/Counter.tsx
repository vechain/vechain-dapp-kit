import {
    Alert,
    AlertIcon,
    Button,
    Heading,
    HStack,
    Icon,
    Text,
    useToast,
    VStack,
} from '@chakra-ui/react';
import type { JSX } from 'react';
import React, { useCallback, useMemo } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { useWallet } from '@vechain/react-wallet-kit';
import { StyledCard } from '../../Components/shared';
import { useCounter } from '../../Hooks/useCounter';
import { AddressButton } from '../../Components';

export const Counter = (): JSX.Element => {
    const { accountState } = useWallet();
    const { count, increment, status, address } = useCounter();
    const toast = useToast();

    const incrementCounter = useCallback(() => {
        increment()
            .then(() => {
                toast({
                    title: 'Counter incremented',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            })
            // eslint-disable-next-line no-console
            .catch(console.error);
    }, [increment, toast]);

    const button = useMemo(() => {
        return (
            <Button
                disabled={
                    !accountState.address ||
                    status === 'pending' ||
                    status === 'in-wallet'
                }
                leftIcon={<Icon as={ArrowUpIcon} />}
                onClick={incrementCounter}
            >
                Increment
            </Button>
        );
    }, [accountState.address, incrementCounter, status]);

    const message = useMemo(() => {
        switch (status) {
            case 'in-wallet':
                return (
                    <Alert status="warning">
                        <AlertIcon />
                        Waiting for wallet approval...
                    </Alert>
                );
            case 'error':
                return (
                    <Alert status="error">
                        <AlertIcon />
                        There was an unexpected error
                    </Alert>
                );
            case 'pending':
                return (
                    <Alert status="warning">
                        <AlertIcon />
                        Waiting for transaction confirmation...
                    </Alert>
                );
            case 'idle':
                return null;
        }
    }, [status]);

    return (
        <StyledCard h={['auto', 'auto', 'full']} p={4}>
            <VStack align="flex-start" spacing={4} w="full">
                <Heading>Counter</Heading>

                <AddressButton address={address} />

                <Text fontSize="xl">
                    Current count: <b>{count}</b>
                </Text>
                <HStack
                    justifyContent="space-between"
                    spacing={4}
                    w="full"
                    wrap="wrap"
                >
                    {button}
                    {message}
                </HStack>
            </VStack>
        </StyledCard>
    );
};

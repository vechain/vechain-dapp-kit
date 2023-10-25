import { Button, Heading, HStack, Link, Text, VStack } from '@chakra-ui/react';
import type { JSX } from 'react';
import { StyledCard } from '../../Components/shared';
import { ConnectWalletButton } from '../../Components';

export const Welcome = (): JSX.Element => {
    return (
        <StyledCard h={['auto', 'auto', 'full']} p={4}>
            <VStack align="flex-start" spacing={4} w="full">
                <Heading>Welcome to the Official VeWorld Demo Dapp</Heading>
                <Text fontSize="xl">
                    You can use this dapp to familiarize and know more about
                    creation on VeChain
                </Text>
                <HStack
                    justifyContent="space-between"
                    spacing={4}
                    w="full"
                    wrap="wrap"
                >
                    <ConnectWalletButton />
                    <Link
                        href="https://github.com/vechainfoundation/veworld-dapp"
                        isExternal
                        ml={0}
                    >
                        <Button colorScheme="blue" variant="link">
                            See the public repository
                        </Button>
                    </Link>
                </HStack>
            </VStack>
        </StyledCard>
    );
};

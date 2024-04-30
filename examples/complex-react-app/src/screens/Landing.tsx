import { Heading, VStack } from '@chakra-ui/react';
import { WalletButton } from '@vechain/dapp-kit-react';

export const Landing = () => {
    return (
        <VStack h={'100vh'} justify="center" spacing={4}>
            <Heading size="lg">Demo Dapp</Heading>
            <WalletButton />
        </VStack>
    );
};

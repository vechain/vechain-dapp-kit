import { Container, Flex, Heading } from '@chakra-ui/react';
import { WalletButton } from '@vechain/dapp-kit-react';
import { NetworkManager } from './components/NetworkManager';

export const Navbar = () => {
    return (
        <Flex borderBottom={'1px solid #eeeeee'} w="100%">
            <Container maxW="container.lg">
                <Flex justify={'space-between'} alignItems={'center'} py="2">
                    <Heading size="md">Demo Dapp</Heading>
                    <NetworkManager />
                    <WalletButton />
                </Flex>
            </Container>
        </Flex>
    );
};

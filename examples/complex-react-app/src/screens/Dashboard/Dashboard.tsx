import { Container, VStack } from '@chakra-ui/react';
import { SendTransaction } from './components/SendTransaction';
import { Navbar } from './components/Navbar';

export const Dashboard = () => {
    return (
        <VStack>
            <Navbar />
            <Container maxW="container.lg">
                <VStack alignItems={'stretch'}>
                    <SendTransaction />
                </VStack>
            </Container>
        </VStack>
    );
};

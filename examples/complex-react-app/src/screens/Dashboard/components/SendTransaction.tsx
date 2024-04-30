import {
    FormControl,
    FormLabel,
    Heading,
    Input,
    VStack,
} from '@chakra-ui/react';

export const SendTransaction = () => {
    return (
        <VStack justifyItems="stretch">
            <Heading size={'xs'}>Send Transaction</Heading>
            <VStack spacing={4}>
                <FormControl>
                    <FormLabel>token address (default VET)</FormLabel>
                    <Input type="text" />
                </FormControl>
                <FormControl>
                    <FormLabel>receiver address</FormLabel>
                    <Input type="text" />
                </FormControl>
                <FormControl>
                    <FormLabel>amount</FormLabel>
                    <Input type="text" />
                </FormControl>
            </VStack>
        </VStack>
    );
};

import React, { useEffect } from 'react';
import { Box, Grid, GridItem, VStack } from '@chakra-ui/react';
import { useWallet } from '@vechainfoundation/dapp-kit-react';
import { Counter, MeetVeWorld, Welcome } from './components';

export const Homepage: React.FC = () => {
    const { account, source } = useWallet();

    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log(account, source);
    }, [account, source]);

    return (
        <VStack spacing={8} w="full">
            <Grid
                alignItems="stretch"
                gap={8}
                justifyItems="stretch"
                templateColumns="repeat(5, 1fr)"
                templateRows="repeat(1, 1fr)"
                w="full"
            >
                <GridItem colSpan={[5, 5, 3]} rowSpan={1}>
                    <Welcome />
                </GridItem>
                <GridItem colSpan={[5, 5, 2]} rowSpan={1}>
                    <MeetVeWorld />
                </GridItem>
            </Grid>
            <Box w="50%">
                <Counter />
            </Box>
        </VStack>
    );
};

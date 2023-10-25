import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import type { JSX } from 'react';
import { VeWorldLogo } from '../../Logos';
import { StyledCard } from '../../Components/shared';

export const MeetVeWorld = (): JSX.Element => {
    return (
        <StyledCard h={['auto', 'auto', 'full']} p={4}>
            <VStack align="flex-start" spacing={4} w="full">
                <HStack justify="space-between" w="full">
                    <Heading>Meet VeWorld</Heading>{' '}
                    <Box h="45px">
                        <VeWorldLogo rounded="lg" />
                    </Box>
                </HStack>
                <Text fontSize="xl">
                    The new browser-based wallet coming straightly from the
                    Vechain Foundation. Built with state of the art
                    technologies, security and ease of use in mind.
                </Text>
                <Button colorScheme="blue" variant="link">
                    Discover more
                </Button>
            </VStack>
        </StyledCard>
    );
};

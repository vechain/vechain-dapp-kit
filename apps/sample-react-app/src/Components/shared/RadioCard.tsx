import type { HTMLChakraProps } from '@chakra-ui/react';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import React from 'react';

interface RadioCardProps extends HTMLChakraProps<'button'> {
    children: React.ReactNode;
    selected: boolean;
    onClick: () => void;
}

export const RadioCard: React.FC<RadioCardProps> = ({
    children,
    selected,
    onClick,
    ...props
}) => {
    return (
        <Button
            shadow={selected ? 'outline' : 'none'}
            variant="outline"
            w="full"
            {...props}
        >
            <HStack
                justify="space-between"
                onClick={onClick}
                spacing={2}
                w="full"
            >
                {children}
                <RadioCircle filled={selected} />
            </HStack>
        </Button>
    );
};

interface RadioCircleProps extends HTMLChakraProps<'div'> {
    filled?: boolean;
}

const RadioCircle: React.FC<RadioCircleProps> = ({
    filled = false,
    ...props
}) => {
    return (
        <Flex
            align="center"
            border="1px solid"
            borderColor="lightgray"
            justify="center"
            p={1}
            rounded="full"
            {...props}
        >
            <Box
                bg={filled ? 'blue.500' : 'transparent'}
                display="block"
                h={2.5}
                margin="auto"
                minW={2.5}
                rounded="full"
                w={2.5}
            />
        </Flex>
    );
};

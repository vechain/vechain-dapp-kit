import { Button, Box, HStack, VStack, Text, Icon } from '@chakra-ui/react';
import { ElementType } from 'react';

interface ActionButtonProps {
    title: string;
    description: string;
    onClick: () => void;
    leftIcon?: ElementType;
    rightIcon?: ElementType;
}

export const ActionButton = ({
    leftIcon,
    rightIcon,
    title,
    description,
    onClick,
}: ActionButtonProps) => {
    return (
        <Button
            w={'full'}
            minH={'70px'}
            h={'fit-content'}
            py={4}
            onClick={onClick}
        >
            <HStack w={'full'} justify={'space-between'}>
                <Box minW={'40px'}>
                    <Icon as={leftIcon} fontSize={'25px'} />
                </Box>
                <VStack textAlign={'left'} w={'full'} flex={1}>
                    <Text w={'full'} fontSize={'sm'} fontWeight={'400'}>
                        {title}
                    </Text>
                    <Text
                        fontSize={'xs'}
                        fontWeight={'400'}
                        opacity={0.5}
                        overflowWrap={'break-word'}
                        wordBreak={'break-word'}
                        whiteSpace={'normal'}
                        w={'full'}
                    >
                        {description}
                    </Text>
                </VStack>
                <VStack minW={'40px'} justifyContent={'flex-end'}>
                    <Icon as={rightIcon} fontSize={'20px'} opacity={0.5} />
                </VStack>
            </HStack>
        </Button>
    );
};

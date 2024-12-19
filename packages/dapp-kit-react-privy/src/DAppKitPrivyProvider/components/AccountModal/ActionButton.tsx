import {
    Button,
    Box,
    HStack,
    VStack,
    Text,
    Icon,
    Image,
} from '@chakra-ui/react';
import { ElementType } from 'react';

interface ActionButtonProps {
    title: string;
    description: string;
    onClick: () => void;
    leftIcon?: ElementType;
    rightIcon?: ElementType;
    leftImage?: string;
    backgroundColor?: string;
    border?: string;
}

export const ActionButton = ({
    leftIcon,
    rightIcon,
    title,
    description,
    onClick,
    leftImage,
    backgroundColor,
    border,
}: ActionButtonProps) => {
    return (
        <Button
            w={'full'}
            minH={'70px'}
            h={'fit-content'}
            py={4}
            onClick={onClick}
            backgroundColor={backgroundColor}
            border={border}
        >
            <HStack w={'full'} justify={'space-between'}>
                <Box minW={'40px'}>
                    {leftImage ? (
                        <Image src={leftImage} alt="left-image" />
                    ) : (
                        <Icon as={leftIcon} fontSize={'25px'} />
                    )}
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

import {
    Button,
    Box,
    HStack,
    VStack,
    Text,
    Icon,
    Image,
    useColorMode,
    Tag,
} from '@chakra-ui/react';
import { ElementType } from 'react';
import { humanAddress } from '../../../utils';

interface AccountDetailsButtonProps {
    title: string;
    address: string;
    onClick: () => void;
    leftIcon?: ElementType;
    rightIcon?: ElementType;
    leftImage?: string;
    backgroundColor?: string;
    border?: string;
    isActive?: boolean;
}

export const AccountDetailsButton = ({
    leftIcon,
    rightIcon,
    title,
    address,
    onClick,
    leftImage,
    isActive = false,
}: AccountDetailsButtonProps) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <Button
            w={'full'}
            minH={'70px'}
            h={'fit-content'}
            py={4}
            onClick={onClick}
            backgroundColor={isDark ? 'transparent' : 'transparent'}
            border={`1px solid ${isDark ? '#ffffff29' : '#ebebeb'}`}
        >
            <HStack w={'full'} justify={'space-between'}>
                <Box minW={'40px'}>
                    {leftImage ? (
                        <Image
                            src={leftImage}
                            w={'25px'}
                            h={'25px'}
                            alt="left-image"
                        />
                    ) : (
                        <Icon as={leftIcon} fontSize={'25px'} />
                    )}
                </Box>
                <VStack textAlign={'left'} w={'full'} flex={1}>
                    <HStack
                        w={'full'}
                        spacing={2}
                        justifyContent={'flex-start'}
                    >
                        <Text fontSize={'sm'} fontWeight={'400'}>
                            {title}
                        </Text>
                        {isActive && (
                            <Tag ml={1} size={'sm'} colorScheme={'green'}>
                                Selected
                            </Tag>
                        )}
                    </HStack>
                    <Text
                        fontSize={'sm'}
                        fontWeight={'500'}
                        opacity={0.5}
                        overflowWrap={'break-word'}
                        wordBreak={'break-word'}
                        whiteSpace={'normal'}
                        w={'full'}
                    >
                        {humanAddress(address, 6, 4)}
                    </Text>
                </VStack>
                <VStack minW={'40px'} justifyContent={'flex-end'}>
                    <Icon as={rightIcon} fontSize={'20px'} opacity={0.5} />
                </VStack>
            </HStack>
        </Button>
    );
};

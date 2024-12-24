import {
    Button,
    Box,
    HStack,
    VStack,
    Text,
    Icon,
    Image,
    Tag,
} from '@chakra-ui/react';
import { ElementType } from 'react';
import { FadeInView } from '../../common';

interface ActionButtonProps {
    title: string;
    description: string;
    onClick: () => void;
    leftIcon?: ElementType;
    rightIcon?: ElementType;
    leftImage?: string;
    backgroundColor?: string;
    border?: string;
    hide?: boolean;
    showComingSoon?: boolean;
}

export const ActionButton = ({
    leftIcon,
    rightIcon,
    title,
    description,
    onClick,
    leftImage,
    hide = false,
    showComingSoon = false,
    backgroundColor,
}: ActionButtonProps) => {
    return (
        <FadeInView>
            <Button
                w={'full'}
                minH={'70px'}
                h={'fit-content'}
                py={4}
                onClick={onClick}
                display={hide ? 'none' : 'flex'}
                isDisabled={showComingSoon}
                bgColor={backgroundColor}
            >
                <HStack w={'full'} justify={'space-between'}>
                    <Box minW={'40px'}>
                        {leftImage ? (
                            <Image src={leftImage} alt="left-image" />
                        ) : (
                            <Icon as={leftIcon} fontSize={'25px'} />
                        )}
                    </Box>
                    <VStack
                        textAlign={'left'}
                        w={'full'}
                        flex={1}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                    >
                        <Text fontSize={'sm'} fontWeight={'400'}>
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
                        {showComingSoon && (
                            <Tag size="sm" colorScheme="red">
                                Coming Soon!
                            </Tag>
                        )}
                    </VStack>
                    <VStack minW={'40px'} justifyContent={'flex-end'}>
                        <Icon as={rightIcon} fontSize={'20px'} opacity={0.5} />
                    </VStack>
                </HStack>
            </Button>
        </FadeInView>
    );
};

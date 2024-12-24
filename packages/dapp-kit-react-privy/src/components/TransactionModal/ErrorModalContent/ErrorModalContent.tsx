import {
    Heading,
    VStack,
    Text,
    ModalCloseButton,
    Button,
    Link,
    Icon,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { ModalAnimation } from '../ModalAnimation';
import { motion } from 'framer-motion';
import { useSmartAccount } from '../../../hooks';
import { EXPLORER_URL } from '../../../utils';
import { MdOutlineErrorOutline } from 'react-icons/md';

export type ErrorModalContentProps = {
    title?: ReactNode;
    description?: string;
    showTryAgainButton?: boolean;
    onTryAgain?: () => void;
    showExplorerButton?: boolean;
    txId?: string;
};

export const ErrorModalContent = ({
    title = 'Something went wrong',
    description = 'Something went wrong 😕',
    showTryAgainButton = false,
    onTryAgain = () => {},
    showExplorerButton,
    txId,
}: ErrorModalContentProps) => {
    const { chainId } = useSmartAccount();
    const explorerUrl = EXPLORER_URL[chainId as keyof typeof EXPLORER_URL];

    return (
        <ModalAnimation>
            <ModalCloseButton top={4} right={4} />
            <VStack align={'center'} p={6} gap={0}>
                <Heading size="md">{title}</Heading>
                <VStack gap={4}>
                    <motion.div
                        transition={{
                            duration: 4,
                            ease: 'easeInOut',
                            repeat: Infinity,
                        }}
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                    >
                        <Icon
                            as={MdOutlineErrorOutline}
                            color={'red'}
                            fontSize={'100px'}
                        />
                    </motion.div>
                    {description && <Text size="sm">{description}</Text>}
                    {showExplorerButton && txId && (
                        <Link
                            href={`${explorerUrl}/transactions/${txId}`}
                            isExternal
                            color="gray.500"
                            fontSize={'14px'}
                            textDecoration={'underline'}
                        >
                            {'View it on the explorer'}
                        </Link>
                    )}
                    {showTryAgainButton && (
                        <Button variant={'outline'} onClick={onTryAgain}>
                            {'Try again'}
                        </Button>
                    )}
                </VStack>
            </VStack>
        </ModalAnimation>
    );
};

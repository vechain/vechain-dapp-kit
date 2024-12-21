import {
    Heading,
    Link,
    ModalCloseButton,
    Spinner,
    Text,
    VStack,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { ModalAnimation } from '../ModalAnimation';
import { useSmartAccount } from '../../../hooks';
import { EXPLORER_URL } from '../../../utils';

export type LoadingModalContentProps = {
    title?: ReactNode;
    showExplorerButton?: boolean;
    txId?: string;
};

export const LoadingModalContent = ({
    title = 'Sending Transaction...',
    showExplorerButton,
    txId,
}: LoadingModalContentProps) => {
    const { chainId } = useSmartAccount();
    const explorerUrl = EXPLORER_URL[chainId as keyof typeof EXPLORER_URL];
    return (
        <ModalAnimation>
            <ModalCloseButton top={4} right={4} />
            <VStack align={'center'} p={6}>
                <Heading size="md">{title}</Heading>
                <Spinner my={10} size="xl" />
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

                {!txId && (
                    <Text fontSize="sm" align={'center'}>
                        {
                            'This may take a few seconds. You can close this window and check the status later.'
                        }
                    </Text>
                )}
            </VStack>
        </ModalAnimation>
    );
};

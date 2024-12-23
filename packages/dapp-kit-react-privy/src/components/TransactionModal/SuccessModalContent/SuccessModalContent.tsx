import {
    Heading,
    Text,
    VStack,
    ModalCloseButton,
    Link,
    Icon,
} from '@chakra-ui/react';
import { ShareButtons } from '../ShareButtons';
import { ReactNode } from 'react';
import { ModalAnimation } from '../ModalAnimation';
import { motion } from 'framer-motion';
import { useSmartAccount } from '../../../hooks';
import { EXPLORER_URL } from '../../../utils';
import { FcCheckmark } from 'react-icons/fc';

export type SuccessModalContentProps = {
    title?: ReactNode;
    showSocialButtons?: boolean;
    socialDescriptionEncoded?: string;
    showExplorerButton?: boolean;
    txId?: string;
};

/**
 * SuccessModalContent is a component that shows a success message with a lottie animation and share buttons
 * @param {SuccessModalContentProps} props - The props of the component
 * @param {boolean} props.isOpen - A boolean to control the visibility of the modal
 * @param {() => void} props.onClose - A function to close the modal
 * @param {string} props.title - The title of the modal
 * @param {string} props.socialDescriptionEncoded - The encoded description to share on social media
 * @returns {React.ReactElement} The SuccessModalContent component
 */
export const SuccessModalContent = ({
    title = 'Transaction completed!',
    showSocialButtons = false,
    showExplorerButton = false,
    txId,
    socialDescriptionEncoded,
}: SuccessModalContentProps) => {
    const { chainId } = useSmartAccount();
    const explorerUrl = EXPLORER_URL[chainId as keyof typeof EXPLORER_URL];

    const socialDescription =
        socialDescriptionEncoded ?? `${explorerUrl}/${txId}`;

    return (
        <ModalAnimation>
            <ModalCloseButton top={4} right={4} />
            <VStack align={'center'} p={6}>
                <Heading size="md">{title}</Heading>
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
                    <Icon as={FcCheckmark} fontSize={'100px'} />
                </motion.div>
                {showExplorerButton && txId && (
                    <Link
                        href={`${explorerUrl}/${txId}`}
                        isExternal
                        color="gray.500"
                        fontSize={'14px'}
                        textDecoration={'underline'}
                    >
                        {'View it on the explorer'}
                    </Link>
                )}
                {showSocialButtons && (
                    <VStack>
                        <Text fontSize="sm">{'Share your transaction'}</Text>
                        <ShareButtons descriptionEncoded={socialDescription} />
                    </VStack>
                )}
            </VStack>
        </ModalAnimation>
    );
};

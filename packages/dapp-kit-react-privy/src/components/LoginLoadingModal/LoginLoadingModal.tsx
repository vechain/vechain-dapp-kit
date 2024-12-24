import {
    Modal,
    ModalBody,
    ModalContent,
    ModalContentProps,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    useMediaQuery,
    VStack,
} from '@chakra-ui/react';

type LoginLoadingModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const LoginLoadingModal = ({
    isOpen,
    onClose,
}: LoginLoadingModalProps) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');
    const _modalContentProps = isDesktop
        ? {}
        : {
              position: 'fixed',
              bottom: '0',
              mb: '0',
              maxW: '2xl',
              borderRadius: '24px 24px 0px 0px',
              overflowY: 'scroll',
              overflowX: 'hidden',
          };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
            size="xs"
            scrollBehavior="inside"
            trapFocus={false}
            autoFocus={false}
        >
            <ModalOverlay />

            <ModalContent {...(_modalContentProps as ModalContentProps)}>
                <ModalHeader></ModalHeader>
                <ModalBody>
                    <VStack w={'full'} justifyContent={'center'}>
                        <Spinner />
                        <Text mt={4} fontSize="sm">
                            Connecting...
                        </Text>
                    </VStack>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    );
};

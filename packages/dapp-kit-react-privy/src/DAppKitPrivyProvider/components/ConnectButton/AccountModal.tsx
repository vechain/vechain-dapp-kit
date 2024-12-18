'use client';

import {
    Button,
    Card,
    CardBody,
    HStack,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalContentProps,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
    useColorMode,
    useMediaQuery,
} from '@chakra-ui/react';
import { useWallet } from '../../hooks';
import { getPicassoImage } from '../../utils';
import { AddressDisplay } from './AddressDisplay';
import { RxExit } from 'react-icons/rx';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const AccountModal = ({ isOpen, onClose }: Props) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');
    const _modalContentProps = isDesktop
        ? {
              borderRadius: '24px 24px 24px 24px',
          }
        : {
              position: 'fixed',
              bottom: '0px',
              mb: '0',
              maxW: '2xl',
              borderRadius: '24px 24px 0px 0px',
          };

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const {
        logoutAndDisconnect,
        isConnectedWithPrivy,
        connectedAccount,
        smartAccount,
        vetDomain,
    } = useWallet();

    const walletImage = getPicassoImage(
        isConnectedWithPrivy
            ? smartAccount.address ?? ''
            : connectedAccount ?? '',
    );

    return (
        <Modal
            motionPreset="slideInBottom"
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size={'sm'}
        >
            <ModalOverlay />
            <ModalContent {...(_modalContentProps as ModalContentProps)}>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'400'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {'Connected'}
                </ModalHeader>
                <VStack justify={'center'}>
                    <Image
                        src={walletImage}
                        maxW={'180px'}
                        maxH={'90px'}
                        m={10}
                        borderRadius="50%"
                    />
                </VStack>

                <ModalCloseButton />
                <ModalBody w={'full'}>
                    <HStack justify={'space-between'} w={'full'}>
                        {isConnectedWithPrivy ? (
                            <>
                                <Card w={'full'}>
                                    <CardBody p={4} textAlign={'center'}>
                                        <AddressDisplay
                                            address={smartAccount.address ?? ''}
                                            label="Smart Account"
                                        />
                                    </CardBody>
                                </Card>
                                <Card w={'full'}>
                                    <CardBody p={4} textAlign={'center'}>
                                        <AddressDisplay
                                            address={connectedAccount ?? ''}
                                            label="Owner"
                                            domain={vetDomain}
                                        />
                                    </CardBody>
                                </Card>
                            </>
                        ) : (
                            <AddressDisplay
                                address={connectedAccount ?? ''}
                                domain={vetDomain}
                            />
                        )}
                    </HStack>
                </ModalBody>
                <ModalFooter>
                    <Button
                        w={'full'}
                        onClick={() => {
                            logoutAndDisconnect();
                            onClose();
                        }}
                        leftIcon={<RxExit />}
                    >
                        Logout
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

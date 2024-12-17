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
    Text,
    VStack,
    useColorMode,
    useMediaQuery,
} from '@chakra-ui/react';
import { useWallet } from '../../hooks';
import { getPicassoImage, humanAddress, humanDomain } from '../../utils';
import { useMemo } from 'react';

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

    const addressOrDomain = isConnectedWithPrivy
        ? humanDomain(smartAccount.address ?? '', 4, 4)
        : humanAddress(connectedAccount ?? '', 4, 4);

    const walletImage = getPicassoImage(
        isConnectedWithPrivy
            ? smartAccount.address ?? ''
            : connectedAccount ?? '',
    );

    const walletCardRenderer = useMemo(() => {
        return vetDomain ? (
            <VStack w={'full'} justifyContent={'center'}>
                <Text fontSize={'sm'}>{vetDomain}</Text>
                <Text fontSize={'sm'}>
                    {'('}
                    {humanAddress(connectedAccount ?? '', 4, 4)}
                    {')'}
                </Text>
            </VStack>
        ) : (
            <VStack w={'full'} justifyContent={'center'}>
                <Text fontSize={'sm'}>
                    {humanAddress(connectedAccount ?? '', 4, 4)}
                </Text>
            </VStack>
        );
    }, [vetDomain, connectedAccount, humanAddress]);

    return (
        <Modal
            motionPreset="slideInBottom"
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size={'sm'}
            variant={'connectModalVariant'}
        >
            <ModalOverlay />
            <ModalContent {...(_modalContentProps as ModalContentProps)}>
                <ModalHeader
                    fontSize={'sm'}
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
                                        <Text
                                            fontSize={'sm'}
                                            fontWeight={'500'}
                                        >
                                            Smart Account
                                        </Text>
                                        <Text fontSize={'sm'}>
                                            {addressOrDomain}
                                        </Text>
                                    </CardBody>
                                </Card>
                                <Card w={'full'}>
                                    <CardBody p={4} textAlign={'center'}>
                                        <Text
                                            fontSize={'sm'}
                                            fontWeight={'500'}
                                        >
                                            Owner
                                        </Text>
                                        {walletCardRenderer}
                                    </CardBody>
                                </Card>
                            </>
                        ) : (
                            walletCardRenderer
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
                    >
                        Logout
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

'use client';

import {
    Button,
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
    useDisclosure,
    useMediaQuery,
} from '@chakra-ui/react';
import { usePrivy } from '@privy-io/react-auth';
import { useWalletModal } from '@vechain/dapp-kit-react';
import { TwitterLogo, GoogleLogo, AppsLogo } from '../../assets/';
import { useDAppKitPrivyConfig } from '../../DAppKitPrivyProvider';
import { EcosystemAppsModal } from './EcosystemAppsModal';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    logo?: string;
};

export const ConnectModal = ({ isOpen, onClose, logo }: Props) => {
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

    const { login } = usePrivy();
    const { open } = useWalletModal();
    const { privyConfig } = useDAppKitPrivyConfig();

    const ecosystemModal = useDisclosure();

    return (
        <>
            <Modal
                motionPreset={isDesktop ? 'none' : 'slideInBottom'}
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                size={'sm'}
            >
                <ModalOverlay />
                {!ecosystemModal.isOpen && (
                    <ModalContent
                        {...(_modalContentProps as ModalContentProps)}
                    >
                        <ModalHeader
                            fontSize={'sm'}
                            fontWeight={'400'}
                            textAlign={'center'}
                            color={isDark ? '#dfdfdd' : '#4d4d4d'}
                        >
                            {'Log in or sign up'}
                        </ModalHeader>
                        <HStack justify={'center'}>
                            <Image
                                src={logo || '/images/favicon.png'}
                                maxW={'180px'}
                                maxH={'90px'}
                                m={10}
                                alt="logo"
                            />
                        </HStack>

                        <ModalCloseButton />
                        <ModalBody>
                            <HStack
                                spacing={4}
                                w={'full'}
                                justify={'center'}
                                mb={'24px'}
                            >
                                <Text
                                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                                    fontSize={14}
                                >
                                    {'Select a login method'}
                                </Text>
                            </HStack>
                            <VStack spacing={4} w={'full'}>
                                <Button
                                    fontSize={'14px'}
                                    fontWeight={'400'}
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                    border={`1px solid ${
                                        isDark ? '#ffffff29' : '#ebebeb'
                                    }`}
                                    p={6}
                                    borderRadius={16}
                                    w={'full'}
                                    onClick={() => {
                                        onClose();
                                        login();
                                    }}
                                >
                                    <HStack
                                        spacing={4}
                                        w={'full'}
                                        justify={'center'}
                                    >
                                        <HStack justify={'start'}>
                                            <TwitterLogo isDark={isDark} />
                                            <GoogleLogo />
                                        </HStack>
                                        <HStack justify={'start'}>
                                            <Text
                                                color={
                                                    isDark
                                                        ? '#dfdfdd'
                                                        : '#4d4d4d'
                                                }
                                            >
                                                {'Continue with Social'}
                                            </Text>
                                        </HStack>
                                    </HStack>
                                </Button>
                                {privyConfig?.ecosystemAppsID &&
                                    privyConfig?.ecosystemAppsID?.length >
                                        0 && (
                                        <>
                                            <Button
                                                fontSize={'14px'}
                                                fontWeight={'400'}
                                                backgroundColor={
                                                    isDark
                                                        ? 'transparent'
                                                        : '#ffffff'
                                                }
                                                border={`1px solid ${
                                                    isDark
                                                        ? '#ffffff29'
                                                        : '#ebebeb'
                                                }`}
                                                p={6}
                                                borderRadius={16}
                                                w={'full'}
                                                color={
                                                    isDark
                                                        ? '#dfdfdd'
                                                        : '#4d4d4d'
                                                }
                                                onClick={() => {
                                                    ecosystemModal.onOpen();
                                                }}
                                            >
                                                <HStack
                                                    spacing={4}
                                                    w={'full'}
                                                    justify={'center'}
                                                >
                                                    <HStack justify={'start'}>
                                                        <AppsLogo
                                                            boxSize={'70px'}
                                                        />
                                                    </HStack>
                                                    <HStack justify={'start'}>
                                                        <Text
                                                            color={
                                                                isDark
                                                                    ? '#dfdfdd'
                                                                    : '#4d4d4d'
                                                            }
                                                        >
                                                            {
                                                                'Continue with VeChain Apps'
                                                            }
                                                        </Text>
                                                    </HStack>
                                                </HStack>
                                            </Button>
                                        </>
                                    )}
                                <Button
                                    fontSize={'14px'}
                                    fontWeight={'400'}
                                    variant={'link'}
                                    w={'full'}
                                    onClick={() => {
                                        onClose();
                                        open();
                                    }}
                                >
                                    <HStack
                                        spacing={4}
                                        w={'full'}
                                        justify={'center'}
                                    >
                                        <Text
                                            color={
                                                isDark ? '#dfdfdd' : '#4d4d4dab'
                                            }
                                        >
                                            {'or continue with Crypto Wallet'}
                                        </Text>
                                    </HStack>
                                </Button>
                            </VStack>
                        </ModalBody>
                        <ModalFooter />
                    </ModalContent>
                )}
            </Modal>

            <EcosystemAppsModal
                isOpen={ecosystemModal.isOpen}
                onClose={() => {
                    ecosystemModal.onClose();
                    onClose();
                }}
                onBack={() => {
                    ecosystemModal.onClose();
                    // Instead of closing the connect modal, we just close the ecosystem modal
                    // which will show the connect modal again
                }}
            />
        </>
    );
};

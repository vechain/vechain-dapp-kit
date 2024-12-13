'use client';

import {
    Button,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalContentProps,
    ModalHeader,
    ModalOverlay,
    VStack,
    useColorMode,
    useMediaQuery,
} from '@chakra-ui/react';
import { useCrossAppAccounts, usePrivy } from '@privy-io/react-auth';
import { useWallet } from '../../hooks';
import { useEffect, useState } from 'react';
import { useDAppKitPrivyConfig } from '../../DAppKitPrivyProvider';
import { AppsLogo } from '../../assets';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const EcosystemAppsModal = ({ isOpen, onClose }: Props) => {
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

    const { authenticated } = usePrivy();
    const { privyConfig } = useDAppKitPrivyConfig();
    const ecosystemAppsID = privyConfig?.ecosystemAppsID;

    const { loginWithCrossAppAccount, linkCrossAppAccount } =
        useCrossAppAccounts();
    const { isCrossAppPrivyAccount } = useWallet();
    const [crossAppLogin, setCrossAppLogin] = useState(false);

    const connectWithVebetterDaoApps = async (appId: string) => {
        setCrossAppLogin(true);
        await loginWithCrossAppAccount({ appId });
    };

    /**
     * After the user logs in we check if the user logged in with a cross app account.
     * If he did, and the account is not linked to, we link it.
     */
    useEffect(() => {
        if (!isCrossAppPrivyAccount && crossAppLogin && authenticated) {
            linkCrossAppAccount({
                appId: `${privyConfig?.ecosystemAppsID?.[0]}`,
            });
        }
    }, [isCrossAppPrivyAccount, crossAppLogin, authenticated]);

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
                    fontSize={'sm'}
                    fontWeight={'400'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    Select VeChain App
                </ModalHeader>
                <HStack justify={'center'} my={10}>
                    <AppsLogo boxSize={'100px'} />
                </HStack>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} w={'full'} pb={6}>
                        {ecosystemAppsID &&
                            ecosystemAppsID.map((appId) => (
                                <Button
                                    key={appId}
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
                                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                                    onClick={() => {
                                        connectWithVebetterDaoApps(appId);
                                        onClose();
                                    }}
                                >
                                    {appId}
                                </Button>
                            ))}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

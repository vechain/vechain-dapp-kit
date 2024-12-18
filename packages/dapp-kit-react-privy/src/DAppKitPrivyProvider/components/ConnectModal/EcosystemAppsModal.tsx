'use client';

import {
    Button,
    HStack,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    Text,
    VStack,
    useColorMode,
    useMediaQuery,
} from '@chakra-ui/react';
import { useCrossAppAccounts, usePrivy } from '@privy-io/react-auth';
import { useWallet } from '../../hooks';
import { useEffect, useState } from 'react';
import { useDAppKitPrivyConfig } from '../../DAppKitPrivyProvider';
import { AppsLogo } from '../../assets';
import { useFetchAppInfo } from '../../hooks/useFetchAppInfo';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    onConnectionSuccess: () => void;
};

export const EcosystemAppsModal = ({
    isOpen,
    onClose,
    onBack,
    onConnectionSuccess,
}: Props) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { privyConfig } = useDAppKitPrivyConfig();
    const { data: appsInfo, isLoading } = useFetchAppInfo(
        privyConfig?.ecosystemAppsID || [],
    );

    const { authenticated } = usePrivy();

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
            motionPreset={isDesktop ? 'none' : 'slideInBottom'}
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size={'sm'}
            blockScrollOnMount={false}
            preserveScrollBarGap={true}
        >
            <ModalContent
                style={{
                    transition:
                        'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
                }}
            >
                <ModalHeader
                    fontSize={'sm'}
                    fontWeight={'400'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    Log in or sign up
                </ModalHeader>
                <HStack justify={'center'}>
                    <AppsLogo maxW={'180px'} maxH={'90px'} m={10} />
                </HStack>
                <ModalCloseButton onClick={onBack} />
                <ModalBody>
                    <VStack spacing={4} w={'full'} pb={6}>
                        <Text
                            color={isDark ? '#dfdfdd' : '#4d4d4d'}
                            fontSize={14}
                        >
                            Select a VeChain App
                        </Text>
                        {appsInfo &&
                            Object.entries(appsInfo).map(([appId, appInfo]) => (
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
                                    justifyContent={'flex-start'}
                                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                                    onClick={() => {
                                        connectWithVebetterDaoApps(appId);
                                        onClose();
                                        onConnectionSuccess();
                                    }}
                                    isDisabled={isLoading}
                                    isLoading={isLoading}
                                >
                                    <Image
                                        src={appInfo.logo_url}
                                        alt={appInfo.name}
                                        w={'30px'}
                                    />
                                    <Text ml={2}>{appInfo.name}</Text>
                                </Button>
                            ))}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

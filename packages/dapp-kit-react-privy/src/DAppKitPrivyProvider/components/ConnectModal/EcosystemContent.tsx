import {
    Button,
    HStack,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    Text,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import { useCrossAppAccounts, usePrivy } from '@privy-io/react-auth';
import { useWallet } from '../../hooks';
import { useEffect, useState } from 'react';
import { useDAppKitPrivyConfig } from '../../DAppKitPrivyProvider';
import { AppsLogo } from '../../assets';
import { FadeInViewFromRight } from '../common';
import { ModalBackButton } from '../common';
import { PrivyAppInfo } from '../../utils';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<'main' | 'ecosystem'>
    >;
    onClose: () => void;
    appsInfo?: Record<string, PrivyAppInfo>;
};

export const EcosystemContent = ({
    setCurrentContent,
    onClose,
    appsInfo,
}: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { privyConfig } = useDAppKitPrivyConfig();
    const { authenticated } = usePrivy();
    const { loginWithCrossAppAccount, linkCrossAppAccount } =
        useCrossAppAccounts();
    const { isCrossAppPrivyAccount } = useWallet();
    const [crossAppLogin, setCrossAppLogin] = useState(false);

    const connectWithVebetterDaoApps = async (appId: string) => {
        setCrossAppLogin(true);
        await loginWithCrossAppAccount({ appId });
        onClose();
    };

    useEffect(() => {
        if (!isCrossAppPrivyAccount && crossAppLogin && authenticated) {
            linkCrossAppAccount({
                appId: `${privyConfig?.ecosystemAppsID?.[0]}`,
            });
        }
    }, [isCrossAppPrivyAccount, crossAppLogin, authenticated]);

    return (
        <FadeInViewFromRight>
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

            <ModalBackButton onClick={() => setCurrentContent('main')} />
            <ModalCloseButton />
            <ModalBody>
                <VStack spacing={4} w={'full'} pb={6}>
                    <Text color={isDark ? '#dfdfdd' : '#4d4d4d'} fontSize={14}>
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
                                onClick={() =>
                                    connectWithVebetterDaoApps(appId)
                                }
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
        </FadeInViewFromRight>
    );
};

import {
    Button,
    HStack,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import { usePrivy } from '@privy-io/react-auth';
import { useWalletModal } from '@vechain/dapp-kit-react';
import { useDAppKitPrivyConfig } from '../../DAppKitPrivyProvider';
import { FadeInViewFromBottom } from '../common';
import { useFetchAppInfo } from '../../hooks/useFetchAppInfo';
import { AppLogos } from '../common/AppLogos';
import { PrivyAppInfo, SOCIAL_INFOS, WALLET_INFOS } from '../../utils';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<'main' | 'ecosystem'>
    >;
    onClose: () => void;
    logo?: string;
    setAppsInfo: React.Dispatch<
        React.SetStateAction<Record<string, PrivyAppInfo> | undefined>
    >;
};

export const MainContent = ({
    setCurrentContent,
    onClose,
    logo,
    setAppsInfo,
}: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { login } = usePrivy();
    const { open } = useWalletModal();
    const { privyConfig } = useDAppKitPrivyConfig();

    const { data: appsInfo, isLoading } = useFetchAppInfo(
        privyConfig?.ecosystemAppsID || [],
    );

    const showEcosystemButton = Boolean(
        privyConfig?.ecosystemAppsID && privyConfig.ecosystemAppsID.length > 0,
    );

    const handleEcosystemClick = () => {
        if (appsInfo) {
            setAppsInfo(appsInfo);
        }
        setCurrentContent('ecosystem');
    };

    // Filter SOCIAL_INFOS based on privyConfig.loginMethods and order by loginMethods
    const configuredSocialInfos = SOCIAL_INFOS.filter((social) =>
        privyConfig?.loginMethods?.includes(social.code as any),
    ).sort(
        (a, b) =>
            privyConfig?.loginMethods?.indexOf(a.code as any) -
            privyConfig?.loginMethods?.indexOf(b.code as any),
    );

    return (
        <FadeInViewFromBottom>
            <ModalHeader
                fontSize={'md'}
                fontWeight={'500'}
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

            <ModalCloseButton mt={'5px'} />
            <ModalBody>
                <HStack spacing={4} w={'full'} justify={'center'} mb={'24px'}>
                    <Text
                        color={isDark ? '#dfdfdd' : '#4d4d4d'}
                        fontSize={'sm'}
                        fontWeight={'200'}
                    >
                        {'Select a login method'}
                    </Text>
                </HStack>
                <VStack spacing={4} w={'full'}>
                    <Button
                        variant={'loginIn'}
                        fontSize={'14px'}
                        fontWeight={'400'}
                        backgroundColor={isDark ? 'transparent' : '#ffffff'}
                        border={`1px solid ${isDark ? '#ffffff29' : '#ebebeb'}`}
                        p={6}
                        borderRadius={16}
                        w={'full'}
                        onClick={() => {
                            onClose();
                            login();
                        }}
                    >
                        <AppLogos
                            apps={configuredSocialInfos}
                            size="40px"
                            textContent="Login with Socials"
                        />
                    </Button>
                    {showEcosystemButton && (
                        <Button
                            variant={'loginIn'}
                            fontSize={'14px'}
                            fontWeight={'400'}
                            backgroundColor={isDark ? 'transparent' : '#ffffff'}
                            border={`1px solid ${
                                isDark ? '#ffffff29' : '#ebebeb'
                            }`}
                            p={6}
                            borderRadius={16}
                            w={'full'}
                            color={isDark ? '#dfdfdd' : '#4d4d4d'}
                            onClick={handleEcosystemClick}
                            isLoading={isLoading}
                        >
                            {appsInfo && (
                                <AppLogos
                                    apps={Object.values(appsInfo)}
                                    size="40px"
                                    textContent="Login with Apps"
                                />
                            )}
                        </Button>
                    )}
                    <Button
                        variant={'loginIn'}
                        fontSize={'14px'}
                        fontWeight={'400'}
                        backgroundColor={isDark ? 'transparent' : '#ffffff'}
                        border={`1px solid ${isDark ? '#ffffff29' : '#ebebeb'}`}
                        p={6}
                        borderRadius={16}
                        w={'full'}
                        onClick={() => {
                            onClose();
                            open();
                        }}
                    >
                        <AppLogos
                            apps={WALLET_INFOS}
                            backgroundColor="black"
                            size="40px"
                            textContent="Login with Wallet"
                        />
                    </Button>
                </VStack>
            </ModalBody>
            <ModalFooter />
        </FadeInViewFromBottom>
    );
};

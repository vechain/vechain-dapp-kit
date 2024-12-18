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
import { TwitterLogo, GoogleLogo } from '../../assets/';
import { useDAppKitPrivyConfig } from '../../DAppKitPrivyProvider';
import { FadeInViewFromBottom } from '../common';
import { useFetchAppInfo } from '../../hooks/useFetchAppInfo';
import { AppLogos } from '../common/AppLogos';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<'main' | 'ecosystem'>
    >;
    onClose: () => void;
    logo?: string;
    setAppsInfo: React.Dispatch<
        React.SetStateAction<Record<string, AppInfo> | undefined>
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

    return (
        <FadeInViewFromBottom>
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
                <HStack spacing={4} w={'full'} justify={'center'} mb={'24px'}>
                    <Text color={isDark ? '#dfdfdd' : '#4d4d4d'} fontSize={14}>
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
                        <HStack spacing={4} w={'full'} justify={'center'}>
                            <HStack justify={'start'}>
                                <TwitterLogo isDark={isDark} />
                                <GoogleLogo />
                            </HStack>
                            <HStack justify={'start'}>
                                <Text color={isDark ? '#dfdfdd' : '#4d4d4d'}>
                                    {'Continue with Social'}
                                </Text>
                            </HStack>
                        </HStack>
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
                                    maxDisplayed={3}
                                    showText={true}
                                    size="40px"
                                    textContent="Continue with VeChain Apps"
                                />
                            )}
                        </Button>
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
                        <HStack spacing={4} w={'full'} justify={'center'}>
                            <Text color={isDark ? '#dfdfdd' : '#4d4d4dab'}>
                                {'or continue with Crypto Wallet'}
                            </Text>
                        </HStack>
                    </Button>
                </VStack>
            </ModalBody>
            <ModalFooter />
        </FadeInViewFromBottom>
    );
};

export type AppInfo = {
    name: string;
    logo_url: string;
    description?: string;
};

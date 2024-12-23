import {
    Button,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    Text,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import { useCrossAppAccounts } from '@privy-io/react-auth';
import { FadeInViewFromBottom } from '../common';
import { ModalBackButton } from '../common';
import { PrivyAppInfo } from '../../utils';
import { useWalletModal } from '@vechain/dapp-kit-react';
import { ConnectModalContents } from './ConnectModal';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContents>
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

    const { loginWithCrossAppAccount } = useCrossAppAccounts();

    const connectWithVebetterDaoApps = async (appId: string) => {
        await loginWithCrossAppAccount({ appId });
        onClose();
    };

    const { open } = useWalletModal();

    // useEffect(() => {
    //     if (
    //         connection.source.type === 'privy-cross-app' &&
    //         crossAppLogin &&
    //         authenticated
    //     ) {
    //         linkCrossAppAccount({
    //             appId: `${privyConfig?.ecosystemAppsID?.[0]}`,
    //         });
    //     }
    // }, [connection.source.type, crossAppLogin, authenticated]);

    return (
        <FadeInViewFromBottom>
            <ModalHeader
                fontSize={'sm'}
                fontWeight={'200'}
                textAlign={'center'}
                color={isDark ? '#dfdfdd' : '#4d4d4d'}
                justifyContent={'center'}
                alignItems={'center'}
            >
                Select wallet
            </ModalHeader>

            <ModalBackButton onClick={() => setCurrentContent('main')} />
            <ModalCloseButton />
            <ModalBody>
                <VStack spacing={4} w={'full'} pb={6}>
                    <Button
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
                        <Text>VeWorld</Text>
                    </Button>

                    <Button
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
                        <Text>WalletConnect</Text>
                    </Button>

                    <Button
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
                        <Text>Sync2</Text>
                    </Button>
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
                                onClick={() =>
                                    connectWithVebetterDaoApps(appId)
                                }
                            >
                                <Image
                                    src={appInfo.logo_url}
                                    alt={appInfo.name}
                                    w={'30px'}
                                />
                                <Text ml={5}>{appInfo.name}</Text>
                            </Button>
                        ))}
                </VStack>
            </ModalBody>
        </FadeInViewFromBottom>
    );
};

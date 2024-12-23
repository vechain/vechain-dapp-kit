import {
    Button,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Spinner,
    Text,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import { useCrossAppAccounts } from '@privy-io/react-auth';
import { FadeInViewFromBottom } from '../../common';
import { ModalBackButton } from '../../common';
import { ConnectModalContents } from '../ConnectModal';
import { useDAppKitPrivyConfig } from '../../../providers';
import { useFetchAppInfo } from '../../../hooks/useFetchAppInfo';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContents>
    >;
    onClose: () => void;
};

export const EcosystemContent = ({ setCurrentContent, onClose }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { loginWithCrossAppAccount } = useCrossAppAccounts();

    const connectWithVebetterDaoApps = async (appId: string) => {
        await loginWithCrossAppAccount({ appId });
        onClose();
    };

    const { privyConfig } = useDAppKitPrivyConfig();
    const { data: appsInfo, isLoading } = useFetchAppInfo(
        privyConfig?.ecosystemAppsID || [],
    );

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
                {isLoading && (
                    <VStack minH={'200px'} w={'full'} justifyContent={'center'}>
                        <Spinner />
                    </VStack>
                )}

                {!isLoading && appsInfo && (
                    <VStack spacing={4} w={'full'} pb={6}>
                        {Object.entries(appsInfo).map(([appId, appInfo]) => (
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
                )}

                {!isLoading && !appsInfo && (
                    <Text>
                        No application from VeChain ecosystem is available to
                        login.
                    </Text>
                )}
            </ModalBody>
            <ModalFooter></ModalFooter>
        </FadeInViewFromBottom>
    );
};

import {
    Button,
    Grid,
    GridItem,
    HStack,
    Icon,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Stack,
    Text,
    useColorMode,
} from '@chakra-ui/react';
import { useCrossAppAccounts, usePrivy } from '@privy-io/react-auth';
import { useDAppKitPrivyConfig } from '../../providers/DAppKitPrivyProvider';
import { FadeInViewFromBottom } from '../common';
import { useFetchAppInfo } from '../../hooks/useFetchAppInfo';
import { PrivyAppInfo, VECHAIN_PRIVY_APP_ID } from '../../utils';
import { HiOutlineWallet } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import { VechainLogoHorizontal } from '../../assets';
import { CiCircleMore } from 'react-icons/ci';
import { useLoginWithOAuth } from '@privy-io/react-auth';
import { ConnectModalContents } from './ConnectModal';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContents>
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
    const { privyConfig } = useDAppKitPrivyConfig();

    const { loginWithCrossAppAccount } = useCrossAppAccounts();

    const { data: appsInfo, isLoading } = useFetchAppInfo(
        privyConfig?.ecosystemAppsID || [],
    );

    const handleEcosystemClick = () => {
        if (appsInfo) {
            setAppsInfo(appsInfo);
        }
        setCurrentContent('ecosystem');
    };

    /**
     * Logic for loggin in with OAuth with whitelabel privy
     */
    const {
        // When the OAuth provider redirects back to your app, the `loading`
        // value can be used to show an intermediate state while login completes.
        initOAuth,
    } = useLoginWithOAuth();

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
                <Stack spacing={4} w={'full'} align={'center'}>
                    <Grid templateColumns="repeat(2, 1fr)" gap={2} w={'full'}>
                        {privyConfig?.loginMethods?.includes('google') && (
                            <GridItem colSpan={2}>
                                <Button
                                    variant={'loginIn'}
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
                                        initOAuth({ provider: 'google' });
                                    }}
                                    leftIcon={
                                        <Icon
                                            as={FcGoogle}
                                            w={'25px'}
                                            h={'25px'}
                                        />
                                    }
                                >
                                    <Text>Continue with Google</Text>
                                </Button>
                            </GridItem>
                        )}

                        <GridItem colSpan={2}>
                            <Button
                                variant={'loginIn'}
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
                                onClick={async () => {
                                    await loginWithCrossAppAccount({
                                        appId: VECHAIN_PRIVY_APP_ID,
                                        // appId: 'clz41gcg00e4ay75dmq3uzzgr',
                                    });
                                    onClose();
                                    onClose();
                                    login();
                                    onClose();
                                    login();
                                }}
                                leftIcon={
                                    <VechainLogoHorizontal
                                        boxSize={'20px'}
                                        isDark={isDark}
                                    />
                                }
                            >
                                <Text>Login with VeChain</Text>
                            </Button>
                        </GridItem>

                        <GridItem>
                            <Button
                                variant={'loginIn'}
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
                                onClick={handleEcosystemClick}
                                isDisabled={isLoading}
                                leftIcon={
                                    <Icon
                                        as={HiOutlineWallet}
                                        w={'20px'}
                                        h={'20px'}
                                    />
                                }
                            >
                                <Text>External wallets</Text>
                            </Button>
                        </GridItem>
                        <GridItem>
                            <Button
                                variant={'loginIn'}
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
                                leftIcon={
                                    <Icon
                                        as={CiCircleMore}
                                        w={'20px'}
                                        h={'20px'}
                                    />
                                }
                            >
                                <Text>See more</Text>
                            </Button>
                        </GridItem>
                    </Grid>
                </Stack>
            </ModalBody>
            <ModalFooter />
        </FadeInViewFromBottom>
    );
};

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
import {
    useCrossAppAccounts,
    usePrivy,
    useLoginWithOAuth,
    useLoginWithPasskey,
} from '@privy-io/react-auth';
import { useDAppKitPrivyConfig } from '../../providers/DAppKitPrivyProvider';
import { FadeInViewFromBottom, VersionFooter } from '../common';
import { HiOutlineWallet } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import { VechainLogo } from '../../assets';
import { CiCircleMore } from 'react-icons/ci';
import { ConnectModalContents } from './ConnectModal';
import { IoIosApps, IoIosFingerPrint } from 'react-icons/io';
import { useWalletModal } from '@vechain/dapp-kit-react';
import { VECHAIN_PRIVY_APP_ID } from '../../utils';
import { useEffect } from 'react';
import { useWallet } from '../../hooks';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContents>
    >;
    onClose: () => void;
    logo?: string;
};

export const MainContent = ({ setCurrentContent, onClose, logo }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { login: viewMoreLogin } = usePrivy();
    const { privyConfig } = useDAppKitPrivyConfig();
    const { open: openDappKitModal } = useWalletModal();
    const { connection } = useWallet();

    const { loginWithCrossAppAccount } = useCrossAppAccounts();
    const { loginWithPasskey } = useLoginWithPasskey();

    useEffect(() => {
        if (connection.isConnected) {
            onClose();
        }
    }, [connection.isConnected]);

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
                    <Grid templateColumns="repeat(4, 1fr)" gap={2} w={'full'}>
                        {privyConfig?.loginMethods?.includes('google') && (
                            <GridItem colSpan={4} w={'full'}>
                                <Button
                                    variant={'loginIn'}
                                    fontSize={'14px'}
                                    fontWeight={'400'}
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                    border={`1px solid ${
                                        isDark ? '#ffffff0a' : '#ebebeb'
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

                        <GridItem colSpan={4} w={'full'}>
                            <Button
                                variant={'loginIn'}
                                fontSize={'14px'}
                                fontWeight={'400'}
                                backgroundColor={
                                    isDark ? 'transparent' : '#ffffff'
                                }
                                border={`1px solid ${
                                    isDark ? '#ffffff0a' : '#ebebeb'
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
                                }}
                                leftIcon={
                                    <VechainLogo
                                        boxSize={'20px'}
                                        isDark={isDark}
                                    />
                                }
                            >
                                <Text>Login with VeChain</Text>
                            </Button>
                        </GridItem>

                        <Button
                            variant={'loginIn'}
                            fontSize={'14px'}
                            fontWeight={'400'}
                            backgroundColor={isDark ? 'transparent' : '#ffffff'}
                            border={`1px solid ${
                                isDark ? '#ffffff0a' : '#ebebeb'
                            }`}
                            p={6}
                            borderRadius={16}
                            w={'full'}
                            onClick={openDappKitModal}
                        >
                            <Icon as={HiOutlineWallet} w={'20px'} h={'20px'} />
                        </Button>

                        <Button
                            variant={'loginIn'}
                            fontSize={'14px'}
                            fontWeight={'400'}
                            backgroundColor={isDark ? 'transparent' : '#ffffff'}
                            border={`1px solid ${
                                isDark ? '#ffffff0a' : '#ebebeb'
                            }`}
                            p={6}
                            borderRadius={16}
                            w={'full'}
                            onClick={() => {
                                setCurrentContent('ecosystem');
                            }}
                        >
                            <Icon as={IoIosApps} w={'20px'} h={'20px'} />
                        </Button>

                        <Button
                            variant={'loginIn'}
                            fontSize={'14px'}
                            fontWeight={'400'}
                            backgroundColor={isDark ? 'transparent' : '#ffffff'}
                            border={`1px solid ${
                                isDark ? '#ffffff0a' : '#ebebeb'
                            }`}
                            p={6}
                            borderRadius={16}
                            w={'full'}
                            onClick={loginWithPasskey}
                        >
                            <Icon as={IoIosFingerPrint} w={'20px'} h={'20px'} />
                        </Button>

                        <Button
                            variant={'loginIn'}
                            fontSize={'14px'}
                            fontWeight={'400'}
                            backgroundColor={isDark ? 'transparent' : '#ffffff'}
                            border={`1px solid ${
                                isDark ? '#ffffff0a' : '#ebebeb'
                            }`}
                            p={6}
                            borderRadius={16}
                            w={'full'}
                            onClick={viewMoreLogin}
                        >
                            <Icon as={CiCircleMore} w={'20px'} h={'20px'} />
                        </Button>
                    </Grid>
                </Stack>
            </ModalBody>

            <ModalFooter>
                <VersionFooter />
            </ModalFooter>
        </FadeInViewFromBottom>
    );
};

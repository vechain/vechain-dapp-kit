import {
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
import { useDAppKitPrivyConfig } from '../../../providers/DAppKitPrivyProvider';
import { FadeInViewFromBottom, VersionFooter } from '../../common';
import { HiOutlineWallet } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import { VechainLogo } from '../../../assets';
import { CiCircleMore } from 'react-icons/ci';
import { ConnectModalContents } from '../ConnectModal';
import { IoIosApps, IoIosFingerPrint } from 'react-icons/io';
import { useWalletModal } from '@vechain/dapp-kit-react';
import { VECHAIN_PRIVY_APP_ID } from '../../../utils';
import { useEffect } from 'react';
import { useWallet } from '../../../hooks';
// import { EmailLoginButton } from '../Components/EmailLoginButton';
import { ConnectionButton } from '../Components';

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
    const { connection } = useWallet();
    const { privyConfig } = useDAppKitPrivyConfig();

    // View more login
    const { login: viewMoreLogin } = usePrivy();

    // Open DappKit modal
    const { open: openDappKitModal } = useWalletModal();

    // Login with Vechain - Cross app account login
    const { loginWithCrossAppAccount } = useCrossAppAccounts();
    // Passkey login
    const { loginWithPasskey } = useLoginWithPasskey();
    const handleLoginWithPasskey = async () => {
        try {
            await loginWithPasskey();
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Login with Google
     * Logic for loggin in with OAuth with whitelabel privy
     */
    const {
        // When the OAuth provider redirects back to your app, the `loading`
        // value can be used to show an intermediate state while login completes.
        initOAuth,
    } = useLoginWithOAuth();

    useEffect(() => {
        if (connection.isConnected) {
            onClose();
        }
    }, [connection.isConnected]);

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
                        {/* {privyConfig?.loginMethods?.includes('email') && (
                            <>
                                <GridItem colSpan={4} w={'full'}>
                                    <EmailLoginButton />
                                </GridItem>
                                <GridItem colSpan={4} w={'full'}>
                                    <HStack>
                                        <Divider />
                                        <Text fontSize={'xs'}>or</Text>
                                        <Divider />
                                    </HStack>
                                </GridItem>
                            </>
                        )} */}
                        {privyConfig?.loginMethods?.includes('google') && (
                            <GridItem colSpan={4} w={'full'}>
                                <ConnectionButton
                                    isDark={isDark}
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
                                    text="Continue with Google"
                                />
                            </GridItem>
                        )}

                        <GridItem colSpan={4} w={'full'}>
                            <ConnectionButton
                                isDark={isDark}
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
                                text="Login with VeChain"
                            />
                        </GridItem>

                        <ConnectionButton
                            isDark={isDark}
                            onClick={openDappKitModal}
                            icon={HiOutlineWallet}
                        />

                        <ConnectionButton
                            isDark={isDark}
                            onClick={() => {
                                setCurrentContent('ecosystem');
                            }}
                            icon={IoIosApps}
                        />

                        <ConnectionButton
                            isDark={isDark}
                            onClick={handleLoginWithPasskey}
                            icon={IoIosFingerPrint}
                        />

                        <ConnectionButton
                            isDark={isDark}
                            onClick={viewMoreLogin}
                            icon={CiCircleMore}
                        />
                    </Grid>
                </Stack>
            </ModalBody>

            <ModalFooter>
                <VersionFooter />
            </ModalFooter>
        </FadeInViewFromBottom>
    );
};

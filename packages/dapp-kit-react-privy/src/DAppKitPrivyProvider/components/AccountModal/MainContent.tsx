import {
    Button,
    Grid,
    HStack,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import { useWallet } from '../../hooks';
import { RxExit } from 'react-icons/rx';
import { AddressDisplay } from '../common/AddressDisplay';
import { FadeInViewFromBottom } from '../common';
import { ActionButton } from './ActionButton';
import { humanAddress } from '../../utils';
import { MdOutlineNavigateNext } from 'react-icons/md';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<'main' | 'settings'>
    >;
    onClose: () => void;
    walletImage: string;
};

export const MainContent = ({
    setCurrentContent,
    onClose,
    walletImage,
}: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const {
        logoutAndDisconnect,
        isConnectedWithPrivy,
        connectedAccount,
        smartAccount,
        vetDomain,
    } = useWallet();

    return (
        <FadeInViewFromBottom>
            <ModalHeader
                fontSize={'md'}
                fontWeight={'500'}
                textAlign={'center'}
                color={isDark ? '#dfdfdd' : '#4d4d4d'}
            >
                {'Connected'}
            </ModalHeader>
            <VStack justify={'center'}>
                <Image
                    src={walletImage}
                    maxW={'180px'}
                    maxH={'90px'}
                    m={10}
                    borderRadius="50%"
                />
            </VStack>

            <ModalCloseButton />
            <ModalBody w={'full'}>
                <HStack justify={'space-between'} w={'full'}>
                    {isConnectedWithPrivy ? (
                        <Grid
                            gap={2}
                            templateColumns={['repeat(1, 1fr)']}
                            w="100%"
                            h="100%"
                        >
                            <ActionButton
                                title="Smart Account"
                                description={humanAddress(
                                    smartAccount.address ?? '',
                                    6,
                                    4,
                                )}
                                onClick={() => {
                                    // setCurrentContent('settings');
                                }}
                                backgroundColor={
                                    isDark ? 'transparent' : 'transparent'
                                }
                                border={`1px solid ${
                                    isDark ? '#ffffff29' : '#ebebeb'
                                }`}
                                // leftImage={SOCIAL_INFOS}
                                rightIcon={MdOutlineNavigateNext}
                            />
                            <ActionButton
                                title="Wallet"
                                description={humanAddress(
                                    connectedAccount ?? '',
                                    6,
                                    4,
                                )}
                                onClick={() => {
                                    setCurrentContent('settings');
                                }}
                                backgroundColor={
                                    isDark ? 'transparent' : 'transparent'
                                }
                                border={`1px solid ${
                                    isDark ? '#ffffff29' : '#ebebeb'
                                }`}
                                // leftImage={SOCIAL_INFOS}
                                rightIcon={MdOutlineNavigateNext}
                            />
                        </Grid>
                    ) : (
                        <AddressDisplay
                            address={connectedAccount ?? ''}
                            domain={vetDomain}
                        />
                    )}
                </HStack>
            </ModalBody>
            <ModalFooter>
                <VStack w={'full'}>
                    {/* {connectionType === 'privy' && (
                        <Button
                            w={'full'}
                            onClick={() => {
                                setCurrentContent('settings');
                            }}
                            fontSize={'sm'}
                            fontWeight={'400'}
                            leftIcon={<RiSettings3Line color="#888888" />}
                        >
                            Wallet settings
                        </Button>
                    )} */}
                    <Button
                        w={'full'}
                        onClick={() => {
                            logoutAndDisconnect();
                            onClose();
                        }}
                        fontSize={'sm'}
                        fontWeight={'400'}
                        leftIcon={<RxExit color="#888888" />}
                    >
                        Logout
                    </Button>
                </VStack>
            </ModalFooter>
        </FadeInViewFromBottom>
    );
};

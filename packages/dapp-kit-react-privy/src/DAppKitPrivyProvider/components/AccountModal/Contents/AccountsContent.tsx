import {
    Button,
    Grid,
    HStack,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import { useWallet, Wallet } from '../../../hooks';
import { RxExit } from 'react-icons/rx';
import { AddressDisplay } from '../../common/AddressDisplay';
import { FadeInViewFromBottom, ModalBackButton } from '../../common';
import { AccountDetailsButton } from '../Components/AccountDetailsButton';
import { MdAccountCircle, MdOutlineNavigateNext } from 'react-icons/md';
import { AccountModalContentTypes } from '../AccountModal';
import { HiOutlineWallet } from 'react-icons/hi2';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    wallet?: Wallet;
};

export const AccountsContent = ({ setCurrentContent, onClose }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { disconnect, connection, selectedAccount, connectedWallet } =
        useWallet();

    return (
        <FadeInViewFromBottom>
            <ModalHeader
                fontSize={'md'}
                fontWeight={'500'}
                textAlign={'center'}
                color={isDark ? '#dfdfdd' : '#4d4d4d'}
            >
                {'Your accounts'}
            </ModalHeader>

            <ModalBackButton onClick={() => setCurrentContent('main')} />
            <ModalCloseButton />

            <ModalBody w={'full'} mt={10}>
                <HStack justify={'space-between'} w={'full'}>
                    {connection.isConnectedWithPrivy ? (
                        <Grid
                            gap={2}
                            templateColumns={['repeat(1, 1fr)']}
                            w="100%"
                            h="100%"
                        >
                            <AccountDetailsButton
                                title="Smart Account"
                                address={selectedAccount.address ?? ''}
                                isActive
                                onClick={() => {
                                    setCurrentContent('smart-account');
                                }}
                                leftIcon={MdAccountCircle}
                                rightIcon={MdOutlineNavigateNext}
                            />
                            <AccountDetailsButton
                                title="Wallet"
                                address={connectedWallet?.address}
                                onClick={() => {
                                    setCurrentContent('settings');
                                }}
                                leftIcon={HiOutlineWallet}
                                rightIcon={MdOutlineNavigateNext}
                            />
                        </Grid>
                    ) : (
                        <AddressDisplay wallet={connectedWallet} />
                    )}
                </HStack>
            </ModalBody>
            <ModalFooter>
                <VStack w={'full'}>
                    <Button
                        w={'full'}
                        onClick={() => {
                            disconnect();
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

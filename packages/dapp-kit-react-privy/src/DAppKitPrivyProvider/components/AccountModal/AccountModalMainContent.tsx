import {
    Button,
    Grid,
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
import { useWallet } from '../../hooks';
import { RxExit } from 'react-icons/rx';
import { AddressDisplay } from '../common/AddressDisplay';
import { FadeInViewFromBottom } from '../common';
import { AccountDetailsButton } from './AccountDetailsButton';
import packageJson from '../../../../package.json';
import { MdAccountCircle, MdOutlineNavigateNext } from 'react-icons/md';
import { AccountModalContentTypes } from './AccountModal';
import { HiOutlineWallet } from 'react-icons/hi2';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    walletImage: string;
};

export const AccountModalMainContent = ({
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
        connectionType,
    } = useWallet();

    const connectionSource =
        connectionType === 'privy-cross-app'
            ? 'app'
            : connectionType === 'privy'
            ? 'social'
            : 'wallet';

    return (
        <FadeInViewFromBottom>
            <ModalHeader
                fontSize={'md'}
                fontWeight={'500'}
                textAlign={'center'}
                color={isDark ? '#dfdfdd' : '#4d4d4d'}
            >
                {'Connected to ' + connectionSource}
                <Text
                    fontSize={'xs'}
                    fontWeight={'400'}
                    w={'full'}
                    textAlign={'center'}
                    opacity={0.3}
                    mt={2}
                >
                    v{packageJson.version}
                </Text>
            </ModalHeader>
            <VStack justify={'center'}>
                <Image
                    src={walletImage}
                    w={'100px'}
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
                            <AccountDetailsButton
                                title="Smart Account"
                                address={smartAccount.address ?? ''}
                                isActive
                                onClick={() => {
                                    setCurrentContent('smart-account');
                                }}
                                leftIcon={MdAccountCircle}
                                rightIcon={MdOutlineNavigateNext}
                            />
                            <AccountDetailsButton
                                title="Wallet"
                                address={smartAccount.ownerAddress ?? ''}
                                onClick={() => {
                                    setCurrentContent('settings');
                                }}
                                leftIcon={HiOutlineWallet}
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

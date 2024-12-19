import {
    Button,
    Card,
    CardBody,
    HStack,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import { useWallet } from '../../../hooks';
import { RxExit } from 'react-icons/rx';
import { RiSettings3Line } from 'react-icons/ri';
import { AddressDisplay } from '../../common/AddressDisplay';
import { FadeInViewFromBottom } from '../../common';

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
        connectionType,
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
                        <>
                            <Card w={'full'}>
                                <CardBody p={4} textAlign={'center'}>
                                    <AddressDisplay
                                        address={smartAccount.address ?? ''}
                                        label="Smart Account"
                                    />
                                </CardBody>
                            </Card>
                            <Card w={'full'}>
                                <CardBody p={4} textAlign={'center'}>
                                    <AddressDisplay
                                        address={connectedAccount ?? ''}
                                        label="Wallet"
                                        domain={vetDomain}
                                    />
                                </CardBody>
                            </Card>
                        </>
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
                    {connectionType === 'privy' && (
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
                    )}
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

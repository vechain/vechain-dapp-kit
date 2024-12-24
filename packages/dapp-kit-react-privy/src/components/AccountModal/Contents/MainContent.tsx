import {
    Button,
    Container,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import { useWallet, Wallet } from '../../../hooks';
import { RxExit } from 'react-icons/rx';
import { AddressDisplay, FadeInViewFromBottom } from '../../common';
import { AccountModalContentTypes } from '../AccountModal';
import { AccountSelector } from '../Components';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    wallet: Wallet;
};

export const MainContent = ({ setCurrentContent, onClose, wallet }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { disconnect, connection } = useWallet();

    return (
        <FadeInViewFromBottom>
            <ModalHeader
                fontSize={'md'}
                fontWeight={'500'}
                textAlign={'center'}
                color={isDark ? '#dfdfdd' : '#4d4d4d'}
            >
                {'Account'}
            </ModalHeader>
            <VStack justify={'center'}>
                <Image
                    src={wallet.image}
                    w="120px"
                    h="120px"
                    m={10}
                    borderRadius="full"
                    objectFit="cover"
                />
            </VStack>

            <ModalCloseButton />

            <Container maxW={'container.lg'}>
                <ModalBody w={'full'}>
                    <VStack w={'full'} spacing={5}>
                        {connection.isConnectedWithPrivy ? (
                            <AccountSelector
                                onClick={() => {
                                    setCurrentContent('accounts');
                                }}
                                wallet={wallet}
                            />
                        ) : (
                            <AddressDisplay wallet={wallet} />
                        )}

                        <Button
                            w={'full'}
                            onClick={() => {
                                disconnect();
                                onClose();
                            }}
                            minH={'40px'}
                            fontSize={'sm'}
                            fontWeight={'400'}
                            leftIcon={<RxExit color="#888888" />}
                        >
                            Logout
                        </Button>
                    </VStack>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </Container>
        </FadeInViewFromBottom>
    );
};

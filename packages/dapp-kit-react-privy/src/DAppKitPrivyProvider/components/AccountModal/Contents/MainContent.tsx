import {
    Button,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import { useWallet, Wallet } from '../../../hooks';
import { RxExit } from 'react-icons/rx';
import {
    AccountSelector,
    AddressDisplay,
    FadeInViewFromBottom,
} from '../../common';
import { AccountModalContentTypes } from '../AccountModal';
import packageJson from '../../../../../package.json';
import React from 'react';

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
                {'Connected with ' + connection.source.displayName}
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
            </VStack>

            <ModalCloseButton />
            <ModalBody w={'full'}></ModalBody>
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
                    <Text
                        fontSize={'10px'}
                        fontWeight={'400'}
                        w={'full'}
                        textAlign={'center'}
                        opacity={0.3}
                        mt={2}
                    >
                        v{packageJson.version}
                    </Text>
                </VStack>
            </ModalFooter>
        </FadeInViewFromBottom>
    );
};

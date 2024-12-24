import {
    Grid,
    HStack,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    useColorMode,
} from '@chakra-ui/react';
import { useWallet, Wallet } from '../../../hooks';
import { AddressDisplay } from '../../common/AddressDisplay';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
} from '../../common';
import { AccountDetailsButton } from '../Components/AccountDetailsButton';
import { MdAccountCircle, MdOutlineNavigateNext } from 'react-icons/md';
import { AccountModalContentTypes } from '../AccountModal';
import { HiOutlineWallet } from 'react-icons/hi2';
import React from 'react';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    wallet?: Wallet;
};

export const AccountsContent = ({ setCurrentContent }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { connection, selectedAccount, connectedWallet } = useWallet();

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
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
            </StickyHeaderContainer>

            <ModalBody w={'full'} pt={'80px'}>
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
            <ModalFooter></ModalFooter>
        </FadeInViewFromBottom>
    );
};

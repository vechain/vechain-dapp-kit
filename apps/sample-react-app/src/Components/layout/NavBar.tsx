import {
    Box,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerOverlay,
    Flex,
    HStack,
    Icon,
    IconButton,
    Text,
    useColorModeValue,
    useDisclosure,
    useMediaQuery,
    VStack,
} from '@chakra-ui/react';
import type { JSX } from 'react';
import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { useWallet } from '@vechain/react-wallet-kit';
import { VechainLogo } from '../../Logos';
import { AccountDetailBody } from '../AccountDetailBody';
import { SwitchWalletButton } from '../SwitchWalletButton';

export const NavBar = (): JSX.Element => {
    const bg = useColorModeValue('gray.50', 'gray.900');
    const [isDesktop] = useMediaQuery('(min-width: 48em)');

    return (
        <Flex
            alignItems="center"
            bg={bg}
            borderBottomWidth="1px"
            flexDirection="row"
            justifyContent="space-between"
            position="sticky"
            px={[4, 4, 20]}
            py={2}
            shadow="xs"
            top={0}
            w="full"
            zIndex={1}
        >
            {isDesktop ? <DesktopNavBar /> : <MobileNavBar />}
        </Flex>
    );
};

const DesktopNavBar = (): JSX.Element => {
    return (
        <>
            <Box h="30px">
                <VechainLogo />
            </Box>
            <NavBarWalletConnect />
        </>
    );
};

const MobileNavBar = (): JSX.Element => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    return (
        <>
            <MobileNavBarDrawer isOpen={isOpen} onClose={onClose} />
            <Box h="30px">
                <VechainLogo />
            </Box>
            <IconButton
                aria-label="light"
                fontSize="20px"
                icon={<Icon as={Bars3Icon} />}
                onClick={onOpen}
            />
        </>
    );
};

interface MobileNavBarDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileNavBarDrawer = ({
    isOpen,
    onClose,
}: MobileNavBarDrawerProps): JSX.Element => {
    const { accountState, disconnect } = useWallet();

    return (
        <Drawer isOpen={isOpen} onClose={onClose} placement="right">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerBody w="full">
                    <VStack h="full" justifyContent="space-between" w="full">
                        <VStack alignItems="flex-start" spacing={4} w="full">
                            <Text>Connected Wallet</Text>
                            {accountState.address && accountState.source ? (
                                <AccountDetailBody
                                    accountAddress={accountState.address}
                                    disconnectWallet={disconnect}
                                    source={accountState.source}
                                />
                            ) : (
                                <SwitchWalletButton />
                            )}
                        </VStack>
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

const NavBarWalletConnect = (): JSX.Element => {
    return (
        <HStack spacing={4}>
            <SwitchWalletButton />
        </HStack>
    );
};

import {
    Image,
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    useColorMode,
    Divider,
    Link,
    Icon,
} from '@chakra-ui/react';
import { useWallet } from '../../hooks';
import React from 'react';
import { AddressDisplay } from '../common/AddressDisplay';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { IoOpenOutline } from 'react-icons/io5';
import { ActionButton } from './ActionButton';
import { ModalBackButton } from '../common';
import { FadeInViewFromRight } from '../common';
import { AccountModalContentTypes } from './AccountModal';
import { FaRegAddressCard } from 'react-icons/fa';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    walletImage: string;
};

export const SmartAccountContent = ({
    setCurrentContent,
    walletImage,
}: Props) => {
    const { privyEmbeddedWallet } = useWallet();

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <FadeInViewFromRight>
            <ModalHeader
                fontSize={'md'}
                fontWeight={'500'}
                textAlign={'center'}
                color={isDark ? '#dfdfdd' : '#4d4d4d'}
            >
                {'Smart Account'}
            </ModalHeader>

            <ModalBackButton onClick={() => setCurrentContent('main')} />
            <ModalCloseButton />
            <ModalBody w={'full'}>
                <VStack justify={'center'} mb={10}>
                    <Image src={walletImage} maxW={'70px'} borderRadius="50%" />
                    <AddressDisplay address={privyEmbeddedWallet ?? ''} />
                </VStack>

                <Text fontSize={'sm'} opacity={0.5}>
                    To allow you a smooth omboarding on VeChain we are helping
                    you manage a wallet.
                </Text>

                <Text fontSize={'sm'} opacity={0.5} mt={5}>
                    You have full control and ownership of this wallet,
                    accessible through your selected login method.
                </Text>

                <Text fontSize={'sm'} opacity={0.5} mt={5}>
                    You can backup your wallet by exporting your private key.
                    This will allow you to restore your wallet if you lose your
                    login method.
                </Text>

                <Text fontSize={'sm'} opacity={0.5} mt={5}>
                    To experience the full blockchain experience, transfer your
                    assets to{' '}
                    <Link
                        href="https://www.veworld.net/"
                        isExternal
                        color="gray.500"
                        fontSize={'14px'}
                        textDecoration={'underline'}
                    >
                        VeWorld Wallet <Icon ml={1} as={IoOpenOutline} />
                    </Link>
                    .
                </Text>

                <Divider mt={10} />

                <VStack w={'full'} mt={10}>
                    <ActionButton
                        title="Choose account name"
                        description="Give a nickname to your smart account to easily identify it."
                        onClick={() => {
                            // linkPasskey();
                        }}
                        isDisabled={true}
                        showComingSoon={true}
                        leftIcon={FaRegAddressCard}
                        rightIcon={MdOutlineNavigateNext}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter />
        </FadeInViewFromRight>
    );
};
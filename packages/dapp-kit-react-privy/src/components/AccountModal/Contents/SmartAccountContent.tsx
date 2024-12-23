import {
    Image,
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    useColorMode,
    Link,
    Icon,
} from '@chakra-ui/react';
import { usePrivy, useWallet } from '../../../hooks';
import React, { useState } from 'react';
import { AddressDisplay } from '../../common/AddressDisplay';
import { IoOpenOutline } from 'react-icons/io5';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
} from '../../common';
import { AccountModalContentTypes } from '../AccountModal';
import { getPicassoImage } from '../../../utils';
import { ActionButton } from '../Components';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { FaRegAddressCard, FaUserEdit } from 'react-icons/fa';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const SmartAccountContent = ({ setCurrentContent }: Props) => {
    const { smartAccount } = useWallet();
    const { exportWallet } = usePrivy();

    const walletImage = getPicassoImage(smartAccount.address ?? '');

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {'Smart Account'}
                </ModalHeader>

                <ModalBackButton
                    onClick={() => setCurrentContent('accounts')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'} pt={'80px'}>
                <VStack justify={'center'} mb={10}>
                    <Image src={walletImage} maxW={'70px'} borderRadius="50%" />
                    <AddressDisplay wallet={smartAccount} />
                </VStack>

                <VStack align="stretch" textAlign={'center'}>
                    <Text fontSize={'sm'} opacity={0.5}>
                        To allow you a smooth onboarding on VeChain we are
                        helping you manage a wallet.
                    </Text>

                    {isExpanded && (
                        <FadeInViewFromBottom>
                            <VStack>
                                <Text fontSize={'sm'} opacity={0.5}>
                                    You have full control and ownership of this
                                    wallet, accessible through your selected
                                    login method.
                                </Text>

                                <Text fontSize={'sm'} opacity={0.5}>
                                    You can backup your wallet by exporting your
                                    private key. This will allow you to restore
                                    your wallet if you lose your login method.
                                </Text>

                                <Text fontSize={'sm'} opacity={0.5}>
                                    To experience the full blockchain
                                    experience, transfer your assets to{' '}
                                    <Link
                                        href="https://www.veworld.net/"
                                        isExternal
                                        color="gray.500"
                                        fontSize={'14px'}
                                        textDecoration={'underline'}
                                    >
                                        VeWorld Wallet{' '}
                                        <Icon ml={1} as={IoOpenOutline} />
                                    </Link>
                                    .
                                </Text>
                            </VStack>
                        </FadeInViewFromBottom>
                    )}

                    <Link
                        onClick={() => setIsExpanded(!isExpanded)}
                        color="gray.500"
                        fontSize={'sm'}
                        transition={'all 0.2s'}
                        _hover={{ textDecoration: 'none' }}
                    >
                        {isExpanded ? 'Read less' : 'Read more'}
                    </Link>
                </VStack>

                <VStack mt={5} spacing={5}>
                    <ActionButton
                        title="Transfer ownership"
                        description="Change the owner of your smart account"
                        onClick={() => {
                            exportWallet();
                        }}
                        leftIcon={FaUserEdit}
                        rightIcon={MdOutlineNavigateNext}
                    />

                    <ActionButton
                        title="Choose account name"
                        description="Give a nickname to your wallet to easily identify it."
                        onClick={() => {
                            // linkPasskey();
                        }}
                        showComingSoon={true}
                        leftIcon={FaRegAddressCard}
                        rightIcon={MdOutlineNavigateNext}
                    />
                    <ActionButton
                        title="Choose account name"
                        description="Give a nickname to your wallet to easily identify it."
                        onClick={() => {
                            // linkPasskey();
                        }}
                        showComingSoon={true}
                        leftIcon={FaRegAddressCard}
                        rightIcon={MdOutlineNavigateNext}
                    />
                    <ActionButton
                        title="Transfer ownership"
                        description="Change the owner of your smart account"
                        onClick={() => {
                            exportWallet();
                        }}
                        leftIcon={FaUserEdit}
                        rightIcon={MdOutlineNavigateNext}
                    />
                    <ActionButton
                        title="Choose account name"
                        description="Give a nickname to your wallet to easily identify it."
                        onClick={() => {
                            // linkPasskey();
                        }}
                        showComingSoon={true}
                        leftIcon={FaRegAddressCard}
                        rightIcon={MdOutlineNavigateNext}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter></ModalFooter>
        </FadeInViewFromBottom>
    );
};

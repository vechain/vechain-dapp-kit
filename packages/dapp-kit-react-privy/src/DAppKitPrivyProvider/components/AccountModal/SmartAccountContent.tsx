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
import React, { useState } from 'react';
import { AddressDisplay } from '../common/AddressDisplay';
import { IoOpenOutline } from 'react-icons/io5';
import { FadeInViewFromBottom, ModalBackButton } from '../common';
import { FadeInViewFromRight } from '../common';
import { AccountModalContentTypes } from './AccountModal';
import { getPicassoImage } from '../../utils';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const SmartAccountContent = ({ setCurrentContent }: Props) => {
    const { smartAccount } = useWallet();

    const walletImage = getPicassoImage(smartAccount.address ?? '');

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const [isExpanded, setIsExpanded] = useState(false);

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
                    <AddressDisplay address={smartAccount.address ?? ''} />
                </VStack>

                <VStack align="stretch" spacing={5}>
                    <Text fontSize={'sm'} opacity={0.5}>
                        To allow you a smooth onboarding on VeChain we are
                        helping you manage a wallet.
                    </Text>

                    <Text fontSize={'sm'} opacity={0.5}>
                        You have full control and ownership of this wallet,
                        accessible through your selected login method.
                    </Text>

                    {isExpanded && (
                        <FadeInViewFromBottom>
                            <Text fontSize={'sm'} opacity={0.5}>
                                You can backup your wallet by exporting your
                                private key. This will allow you to restore your
                                wallet if you lose your login method.
                            </Text>

                            <Text fontSize={'sm'} opacity={0.5}>
                                To experience the full blockchain experience,
                                transfer your assets to{' '}
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
                        </FadeInViewFromBottom>
                    )}

                    <Link
                        onClick={() => setIsExpanded(!isExpanded)}
                        color="gray.500"
                        fontSize={'sm'}
                        _hover={{ textDecoration: 'none' }}
                    >
                        {isExpanded ? 'Read less' : 'Read more'}
                    </Link>
                </VStack>

                <Divider mt={10} />
            </ModalBody>
            <ModalFooter />
        </FadeInViewFromRight>
    );
};

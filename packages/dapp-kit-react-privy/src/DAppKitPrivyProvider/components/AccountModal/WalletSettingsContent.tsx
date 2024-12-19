import {
    Image,
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    useColorMode,
} from '@chakra-ui/react';
import { usePrivy, useWallet } from '../../hooks';
import { AddressDisplay } from '../common/AddressDisplay';
import { GiHouseKeys } from 'react-icons/gi';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { IoIosFingerPrint } from 'react-icons/io';
import { ActionButton } from './ActionButton';
import { ModalBackButton } from '../common';
import { useDAppKitPrivyConfig } from '../../DAppKitPrivyProvider';
import { FadeInViewFromRight } from '../common';
import { AccountModalContentTypes } from './AccountModal';
import { FaRegAddressCard } from 'react-icons/fa';

type Props = {
    setCurrentContent: (content: AccountModalContentTypes) => void;
    walletImage: string;
};

export const WalletSettingsContent = ({
    setCurrentContent,
    walletImage,
}: Props) => {
    const { exportWallet, linkPasskey } = usePrivy();
    const { privyConfig } = useDAppKitPrivyConfig();

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
                {'Wallet Settings'}
            </ModalHeader>

            <ModalBackButton onClick={() => setCurrentContent('main')} />
            <ModalCloseButton />
            <ModalBody w={'full'}>
                <VStack justify={'center'}>
                    <Image src={walletImage} maxW={'70px'} borderRadius="50%" />
                    <AddressDisplay address={privyEmbeddedWallet ?? ''} />
                </VStack>

                <VStack w={'full'} mt={10}>
                    <ActionButton
                        title="Backup your wallet"
                        description="Export your private key"
                        onClick={() => {
                            exportWallet();
                        }}
                        leftIcon={GiHouseKeys}
                        rightIcon={MdOutlineNavigateNext}
                    />

                    {privyConfig.allowPasskeyLinking && (
                        <ActionButton
                            title="Add passkey"
                            description="Add a passkey to your account for future logins. If enabled, passkeys will always be available as a login method."
                            onClick={() => {
                                linkPasskey();
                            }}
                            leftIcon={IoIosFingerPrint}
                            rightIcon={MdOutlineNavigateNext}
                        />
                    )}

                    <ActionButton
                        title="Choose account name"
                        description="Give a nickname to your wallet to easily identify it."
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

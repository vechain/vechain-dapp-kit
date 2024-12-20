import {
    Image,
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    useColorMode,
} from '@chakra-ui/react';
import { usePrivy, useWallet, Wallet } from '../../../hooks';
import { AddressDisplay } from '../../common/AddressDisplay';
import { GiHouseKeys } from 'react-icons/gi';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { IoIosFingerPrint } from 'react-icons/io';
import { ActionButton } from '../Components/ActionButton';
import { ModalBackButton } from '../../common';
import { useDAppKitPrivyConfig } from '../../../DAppKitPrivyProvider';
import { FadeInViewFromBottom } from '../../common';
import { AccountModalContentTypes } from '../AccountModal';
import { FaRegAddressCard } from 'react-icons/fa';

type Props = {
    setCurrentContent: (content: AccountModalContentTypes) => void;
};

export const WalletSettingsContent = ({ setCurrentContent }: Props) => {
    const { exportWallet, linkPasskey } = usePrivy();
    const { privyConfig } = useDAppKitPrivyConfig();

    const { embeddedWallet, connection, crossAppWallet } = useWallet();

    // Privy always creates an embedded wallet, so if the user is connected with app we use the other
    const account: Wallet = connection.isConnectedWithCrossAppPrivy
        ? crossAppWallet
        : embeddedWallet;

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <FadeInViewFromBottom>
            <ModalHeader
                fontSize={'md'}
                fontWeight={'500'}
                textAlign={'center'}
                color={isDark ? '#dfdfdd' : '#4d4d4d'}
            >
                {'Wallet Settings'}
            </ModalHeader>

            <ModalBackButton onClick={() => setCurrentContent('accounts')} />
            <ModalCloseButton />
            <ModalBody w={'full'}>
                <VStack justify={'center'}>
                    <Image
                        src={account.image}
                        maxW={'70px'}
                        borderRadius="50%"
                    />
                    <AddressDisplay wallet={account} />
                </VStack>

                <VStack w={'full'} mt={10}>
                    <ActionButton
                        title="Backup your wallet"
                        description="Export your private key"
                        onClick={() => {
                            exportWallet();
                        }}
                        hide={connection.isConnectedWithCrossAppPrivy}
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
                            hide={connection.isConnectedWithCrossAppPrivy}
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
                        showComingSoon={true}
                        leftIcon={FaRegAddressCard}
                        rightIcon={MdOutlineNavigateNext}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter />
        </FadeInViewFromBottom>
    );
};

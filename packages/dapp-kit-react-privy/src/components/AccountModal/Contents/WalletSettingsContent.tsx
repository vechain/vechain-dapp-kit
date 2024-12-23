import {
    Image,
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    useColorMode,
    Text,
} from '@chakra-ui/react';
import { usePrivy, useWallet, Wallet } from '../../../hooks';
import { AddressDisplay } from '../../common/AddressDisplay';
import { GiHouseKeys } from 'react-icons/gi';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { IoIosFingerPrint } from 'react-icons/io';
import { ActionButton } from '../Components/ActionButton';
import { ModalBackButton } from '../../common';
import { useDAppKitPrivyConfig } from '../../../providers/DAppKitPrivyProvider';
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
                {'Wallet'}
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

                <VStack align="stretch" spacing={5} mt={2}>
                    <Text fontSize={'sm'} opacity={0.5} textAlign={'center'}>
                        This is your main wallet and identity. Please be sure to
                        keep it safe and backed up.
                    </Text>
                </VStack>

                <VStack w={'full'} mt={10}>
                    <ActionButton
                        title="Backup your wallet"
                        description="Upgrade wallet in Self-Custody by storing your Recovery Phrase and seamlessly importing it into a wallet provider."
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
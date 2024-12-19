import {
    Image,
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    useColorMode,
} from '@chakra-ui/react';
import { usePrivy, useWallet } from '../../../hooks';
import React from 'react';
import { AddressDisplay } from '../../common/AddressDisplay';
import { GiHouseKeys } from 'react-icons/gi';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { IoIosFingerPrint } from 'react-icons/io';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';
import { ActionButton } from './ActionButton';
import packageJson from '../../../../../package.json';
import { ModalBackButton } from '../../common';
import { useDAppKitPrivyConfig } from '../../../DAppKitPrivyProvider';
import { FadeInViewFromRight } from '../../common';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<'main' | 'settings'>
    >;
    walletImage: string;
};

export const SettingsContent = ({ setCurrentContent, walletImage }: Props) => {
    const { exportWallet, setWalletRecovery, linkPasskey } = usePrivy();
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
            <VStack justify={'center'} m={5}>
                <Image src={walletImage} maxW={'50px'} borderRadius="50%" />
                <AddressDisplay address={privyEmbeddedWallet ?? ''} />
            </VStack>

            <ModalBackButton onClick={() => setCurrentContent('main')} />
            <ModalCloseButton />
            <ModalBody w={'full'}>
                <VStack w={'full'}>
                    <ActionButton
                        title="Backup your wallet"
                        description="Export your private key"
                        onClick={() => {
                            exportWallet();
                        }}
                        leftIcon={GiHouseKeys}
                        rightIcon={MdOutlineNavigateNext}
                    />

                    <ActionButton
                        title="Set up wallet recovery"
                        description="Set a password to secure your account"
                        onClick={() => {
                            setWalletRecovery(true);
                        }}
                        leftIcon={IoShieldCheckmarkOutline}
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
                </VStack>
            </ModalBody>
            <ModalFooter>
                <Text
                    fontSize={'sm'}
                    fontWeight={'400'}
                    w={'full'}
                    textAlign={'center'}
                    opacity={0.5}
                >
                    v{packageJson.version}
                </Text>
            </ModalFooter>
        </FadeInViewFromRight>
    );
};

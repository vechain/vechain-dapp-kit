import { Button, HStack, Image, Text, useDisclosure } from '@chakra-ui/react';
import { useWallet } from '../../hooks';
import { ConnectModal } from '../ConnectModal';
import { AccountModal } from '../AccountModal';
import { useDAppKitPrivyConfig } from '../../DAppKitPrivyProvider';
import { getPicassoImage, humanAddress } from '../../utils';

export const WalletButton = () => {
    const { isConnected, isLoadingConnection, selectedAddress } = useWallet();

    const walletImage = getPicassoImage(selectedAddress ?? '');

    const connectModal = useDisclosure();
    const accountModal = useDisclosure();

    const { privyConfig } = useDAppKitPrivyConfig();

    return (
        <>
            {isLoadingConnection ? (
                <p>Loading...</p>
            ) : (
                <>
                    {isConnected ? (
                        <Button onClick={accountModal.onOpen} p={'9px 12px'}>
                            <HStack>
                                <Image
                                    className="address-icon mobile"
                                    src={walletImage}
                                    alt="wallet"
                                    width={23}
                                    height={23}
                                    borderRadius="50%"
                                />
                                <Text fontSize="sm">
                                    {humanAddress(selectedAddress ?? '', 6, 4)}
                                </Text>
                            </HStack>
                        </Button>
                    ) : (
                        <Button onClick={connectModal.onOpen}>Login</Button>
                    )}

                    <ConnectModal
                        isOpen={connectModal.isOpen}
                        onClose={connectModal.onClose}
                        logo={privyConfig.appearance.logo}
                    />

                    <AccountModal
                        isOpen={accountModal.isOpen}
                        onClose={accountModal.onClose}
                    />
                </>
            )}
        </>
    );
};

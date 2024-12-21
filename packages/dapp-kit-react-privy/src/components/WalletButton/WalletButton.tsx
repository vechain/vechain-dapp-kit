import { Button, HStack, Image, Text, useDisclosure } from '@chakra-ui/react';
import { useWallet } from '../../hooks';
import { ConnectModal } from '../ConnectModal';
import { AccountModal } from '../AccountModal';
import { useDAppKitPrivyConfig } from '../../providers/DAppKitPrivyProvider';
import { humanAddress } from '../../utils';

export const WalletButton = () => {
    const { connection, selectedAccount } = useWallet();

    const connectModal = useDisclosure();
    const accountModal = useDisclosure();

    const { privyConfig } = useDAppKitPrivyConfig();

    return (
        <>
            {connection.isConnected ? (
                <Button onClick={accountModal.onOpen} p={'9px 12px'}>
                    <HStack>
                        <Image
                            className="address-icon mobile"
                            src={selectedAccount.image}
                            alt="wallet"
                            width={23}
                            height={23}
                            borderRadius="50%"
                        />
                        <Text fontSize="sm">
                            {humanAddress(selectedAccount.address, 6, 4)}
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
    );
};

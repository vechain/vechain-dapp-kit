import { Button, HStack, Image, Text, useDisclosure } from '@chakra-ui/react';
import { useWallet } from '../../hooks';
import { ConnectModal } from '../ConnectModal';
import { AccountModal } from '../AccountModal';
import { useDAppKitPrivyConfig } from '../../providers/DAppKitPrivyProvider';
import { humanAddress } from '../../utils';
import { useLoginWithOAuth, usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { LoginLoadingModal } from '../LoginLoadingModal';

export const WalletButton = () => {
    const { connection, selectedAccount } = useWallet();
    const { authenticated, user, createWallet } = usePrivy();

    const connectModal = useDisclosure();
    const accountModal = useDisclosure();

    const { privyConfig } = useDAppKitPrivyConfig();

    const { loading: isLoadingLoginOAuth } = useLoginWithOAuth({});

    // If the user authenticates directly with google, we need to wait for success
    // and if it's first time we create an embedded wallet for the user
    useEffect(() => {
        const embeddedWallet = user?.wallet?.address;

        const asyncCreateWallet = async () => {
            await createWallet();
        };

        if (authenticated && !isLoadingLoginOAuth && !embeddedWallet) {
            try {
                asyncCreateWallet();
            } catch (error) {
                // if user already has an embedded wallet, this will throw an error
                console.error(error);
            }
        }
    }, [authenticated, isLoadingLoginOAuth, user]);

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

            <LoginLoadingModal
                isOpen={isLoadingLoginOAuth}
                onClose={() => {}}
            />
        </>
    );
};

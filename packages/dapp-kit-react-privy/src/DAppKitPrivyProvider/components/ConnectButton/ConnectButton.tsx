import { Button, Image, useDisclosure } from '@chakra-ui/react';
import { useWallet } from '../../hooks';
import { ConnectModal } from '../ConnectModal';
import { AccountModal } from './AccountModal';
import { useDAppKitPrivyConfig } from '../../DAppKitPrivyProvider';
import { getPicassoImage, humanAddress, humanDomain } from '../../utils';

export const ConnectButton = () => {
    const {
        isConnected,
        isLoadingConnection,
        isConnectedWithPrivy,
        connectedAccount,
        smartAccount,
    } = useWallet();

    const addressOrDomain = isConnectedWithPrivy
        ? humanDomain(smartAccount.address ?? '', 4, 4)
        : humanAddress(connectedAccount ?? '', 4, 4);

    const walletImage = getPicassoImage(
        isConnectedWithPrivy
            ? smartAccount.address ?? ''
            : connectedAccount ?? '',
    );

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
                        <Button onClick={accountModal.onOpen}>
                            {isLoadingConnection || !isConnected ? (
                                'Loading...'
                            ) : (
                                <>
                                    <Image
                                        className="address-icon mobile"
                                        src={walletImage}
                                        alt="wallet"
                                        width={23}
                                        height={23}
                                        borderRadius="50%"
                                        marginRight={2}
                                    />
                                    {addressOrDomain}
                                </>
                            )}
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

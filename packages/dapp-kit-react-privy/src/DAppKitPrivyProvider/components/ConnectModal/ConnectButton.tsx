import { Button, useDisclosure } from '@chakra-ui/react';
import { useWallet } from '../../hooks';
import { ConnectModal } from './ConnectModal';
import React from 'react';
import { useDAppKitPrivyConfig } from '../../DAppKitPrivyProvider';

export const ConnectButton = () => {
    const { isConnected, logoutAndDisconnect, isLoadingConnection } =
        useWallet();

    const connectModal = useDisclosure();

    const { privyConfig } = useDAppKitPrivyConfig();

    return (
        <>
            {isLoadingConnection ? (
                <p>Loading...</p>
            ) : (
                <>
                    {isConnected ? (
                        <Button onClick={logoutAndDisconnect}>Logout</Button>
                    ) : (
                        <Button onClick={connectModal.onOpen}>Login</Button>
                    )}

                    {/* {isConnected && (
                       
                    )} */}

                    <ConnectModal
                        isOpen={connectModal.isOpen}
                        onClose={connectModal.onClose}
                        logo={privyConfig.appearance.logo}
                    />
                </>
            )}
        </>
    );
};

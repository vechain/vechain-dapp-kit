'use client';

import { type ReactElement } from 'react';
import { useDisclosure, Button } from "@chakra-ui/react";
import {
    useWalletAdapter,
    // dappKitModal,
    ConnectModal,
} from "@vechain/dapp-kit-react-privy";

const HomePage = (): ReactElement => {
    const { isConnected, connectedAddress, logout } =
        useWalletAdapter();

    const {
        isOpen: isLoginOpen,
        onOpen: onLoginOpen,
        onClose: onLoginClose,
    } = useDisclosure();
    //const isInAppBrowser = window.vechain && window.vechain.isInAppBrowser;

    return (
        <div>
            {isConnected ? (
                <Button onClick={logout}>Disconnect</Button>
            ) : (
                <Button onClick={onLoginOpen}>Connect</Button>
            )}

            {isConnected && (
                <div>
                    <p>Connected Address: {connectedAddress}</p>
                </div>
            )}

            <ConnectModal
                isOpen={isLoginOpen}
                onClose={onLoginClose}
                logo={"https://cleanify.vet/logo/cleanify_green.png"}
            />
        </div>
    );
};

// eslint-disable-next-line import/no-default-export
export default HomePage;

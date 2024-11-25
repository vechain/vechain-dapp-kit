'use client';

import { type ReactElement } from 'react';
import { useDisclosure, Button } from "@chakra-ui/react";
import {
    useWalletAdapter,
    // dappKitModal,
    ConnectModal,
} from "@vechain/dapp-kit-react-privy";

const HomePage = (): ReactElement => {
    const { isConnected, isConnectedWithPrivy, isConnectedWithDappKit, connectedAddress, abstractedAccount, logout } =
        useWalletAdapter();

    const {
        isOpen: isLoginOpen,
        onOpen: onLoginOpen,
        onClose: onLoginClose,
    } = useDisclosure();
    //const isInAppBrowser = window.vechain && window.vechain.isInAppBrowser;

    return (
        <div className="container">
            {isConnected ? (
                <Button onClick={logout}>Disconnect</Button>
            ) : (
                <Button onClick={onLoginOpen}>Connect</Button>
            )}

            {isConnected && (
                <div>
                    <p>Connected with Privy: {isConnectedWithPrivy.toString()}</p>
                    <p>Connected with DappKit: {isConnectedWithDappKit.toString()}</p>
                    <p>Abstracted Account: {abstractedAccount.embeddedWallet?.address}</p>
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

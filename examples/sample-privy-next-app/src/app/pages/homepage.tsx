'use client';

import { type ReactElement } from 'react';
import { useDisclosure, Button } from '@chakra-ui/react';
import {
    useWallet,
    useVOT3Balance,
    useB3TRBalance,
    ConnectModal,
} from '@vechain/dapp-kit-react-privy';

const HomePage = (): ReactElement => {
    const {
        isConnected,
        isConnectedWithPrivy,
        isConnectedWithDappKit,
        connectedAddress,
        smartAccount,
        logoutAndDisconnect,
    } = useWallet();
    const b3trBalanceQuery = isConnected
        ? useB3TRBalance({ address: connectedAddress ?? '' })
        : useB3TRBalance({
              address: smartAccount.address ?? '',
          });
    const vot3BalanceQuery = isConnected
        ? useVOT3Balance({ address: connectedAddress ?? '' })
        : useVOT3Balance({
              address: smartAccount.address ?? '',
          });
    const {
        isOpen: isLoginOpen,
        onOpen: onLoginOpen,
        onClose: onLoginClose,
    } = useDisclosure();

    return (
        <div className="container">
            {isConnected ? (
                <Button onClick={logoutAndDisconnect}>Disconnect</Button>
            ) : (
                <Button onClick={onLoginOpen}>Connect</Button>
            )}

            {isConnected && (
                <div>
                    <p>Connected Address: {connectedAddress}</p>
                    <p>
                        Connected with Privy: {isConnectedWithPrivy.toString()}
                    </p>
                    <p>
                        Connected with DappKit:{' '}
                        {isConnectedWithDappKit.toString()}
                    </p>
                    <p>Smart Account: {smartAccount.address}</p>
                    <p>
                        Smart Account Deployed:{' '}
                        {smartAccount.isDeployed.toString()}
                    </p>
                    <p>
                        B3TR Balance:{' '}
                        {b3trBalanceQuery.isLoading
                            ? 'Loading...'
                            : b3trBalanceQuery.data ?? 'N/A'}
                    </p>
                    <p>
                        VOT3 Balance:{' '}
                        {vot3BalanceQuery.isLoading
                            ? 'Loading...'
                            : vot3BalanceQuery.data ?? 'N/A'}
                    </p>
                </div>
            )}

            <ConnectModal
                isOpen={isLoginOpen}
                onClose={onLoginClose}
                logo={'https://i.ibb.co/ZHGmq3y/image-21.png'}
            />
        </div>
    );
};

export default HomePage;

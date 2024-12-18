import React, { useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets, type ConnectedWallet } from '@privy-io/react-auth';
import { b3trAbi, b3trMainnetAddress } from '../constants';
import { ThorClient, VeChainProvider } from '@vechain/sdk-network';
import { SmartAccountSigner } from '@vechain/dapp-kit-react-privy';

const SignComponent = ({
    connectedAccount,
}: {
    connectedAccount: string | undefined;
}) => {
    const { signTypedData } = usePrivy();
    const { wallets } = useWallets();

    const embeddedWallet = useMemo<ConnectedWallet | undefined>(() => {
        return wallets.find((wallet) => wallet.walletClientType === 'privy');
    }, [wallets]);

    const THOR_CLIENT = ThorClient.at('https://mainnet.vechain.org');
    const signer = new SmartAccountSigner(
        signTypedData,
        embeddedWallet!,
        new VeChainProvider(THOR_CLIENT),
    );

    const testSigner = async () => {
        signer.sendTransaction({
            clauses: [
                {
                    to: b3trMainnetAddress,
                    value: '0x0',
                    data: b3trAbi.encodeFunctionData('transfer', [
                        connectedAccount,
                        '0', // 1 B3TR (in wei)
                    ]),
                    comment: `Transfer ${1} B3TR to `,
                },
            ],
        });
    };

    return <button onClick={testSigner}>Sign Transaction</button>;
};

export default SignComponent;

import React, { useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets, type ConnectedWallet } from '@privy-io/react-auth';
import { b3trAbi, b3trMainnetAddress } from '../constants';
import { ThorClient, VeChainProvider } from '@vechain/sdk-network';
import { SmartAccountSigner } from '@vechain/dapp-kit-react-privy';

const SignComponent = async ({
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
        const thorClient = ThorClient.at('https://mainnet.vechain.org');
        const b3trContract = thorClient.contracts.load(
            b3trMainnetAddress,
            b3trAbi,
        );
        b3trContract.setSigner(signer);
        const result = await b3trContract.transact.transfer(
            connectedAccount as string,
            BigInt(1),
        );
        const receipt = await result.wait();
        // eslint-disable-next-line no-console
        console.log('txId: ', receipt?.meta.txID);
    };

    return (
        <button onClick={async () => await testSigner()}>
            Sign Transaction
        </button>
    );
};

export default SignComponent;

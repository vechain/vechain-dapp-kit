import type { VechainWallet } from '../types';

import { VeChainSignerDAppKit } from '../classes/vechain-signer';
import { ThorClient, VeChainProvider } from '@vechain/sdk-network';

export const createSDKSigner = (
    wallet: VechainWallet,
    address: string,
): VeChainSignerDAppKit | undefined => {
    return new VeChainSignerDAppKit(
        wallet,
        address,
        new VeChainProvider(ThorClient.fromUrl('https://testnet.vechain.org')),
    );
};

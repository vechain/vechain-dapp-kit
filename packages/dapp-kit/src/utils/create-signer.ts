import type { Genesis, WalletSource } from '../types';

import { normalizeGenesisId } from './genesis';
import { DAppKitLogger } from './logger';
import { VeChainSignerDappKit } from '../classes/vechain-signer';
import { ThorClient, VeChainProvider } from '@vechain/sdk-network';

export const createSDKSigner = (
    source: WalletSource,
    genesis: Genesis,
    address: string,
): VeChainSignerDappKit | undefined => {
    const genesisId = normalizeGenesisId(genesis);

    DAppKitLogger.debug('createWallet', source);

    switch (source) {
        case 'veworld': {
            if (!window.vechain) {
                throw new Error('VeWorld Extension is not installed');
            }

            const signer = window.vechain.newConnexSigner(genesisId);

            return new VeChainSignerDappKit(
                signer,
                address,
                new VeChainProvider(
                    ThorClient.fromUrl('https://testnet.vechain.org'),
                ),
            );
        }
        default:
            return undefined;
    }
};

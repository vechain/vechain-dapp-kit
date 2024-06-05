import type { ThorClient } from '@vechain/sdk-network';
import { VeChainProvider, VeChainSigner } from '@vechain/sdk-network';
import { ProviderWallet } from './provider-wallet';

class EthersProvider extends VeChainProvider {
    constructor(
        readonly thorClient: ThorClient,
        readonly wallet: ProviderWallet,
        readonly enableDelegation: boolean = false,
    ) {
        super(thorClient, wallet, enableDelegation);
    }

    getSignerSync(): VeChainSigner {
        return this.wallet.getSignerSync(this);
    }
}

export { EthersProvider };

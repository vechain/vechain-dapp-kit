import type { ThorClient } from '@vechain/sdk-network';
import { VechainProvider, VechainSigner } from '@vechain/sdk-network';
import { ProviderWallet } from './provider-wallet';

class EthersProvider extends VechainProvider {
    constructor(
        readonly thorClient: ThorClient,
        readonly wallet: ProviderWallet,
        readonly enableDelegation: boolean = false,
    ) {
        super(thorClient, wallet, enableDelegation);
    }

    getSignerSync(): VechainSigner {
        return this.wallet.getSignerSync(this);
    }
}

export { EthersProvider };

import { HttpClient, ThorClient } from '@vechain/sdk-network';
import { EthersProvider, ProviderWallet, WalletManager } from './classes';
import { DAppKitLogger } from './utils';
import type { DAppKitOptions } from './types';

class DAppKit {
    public readonly thor: ThorClient;
    public readonly wallet: WalletManager;
    public readonly provider: EthersProvider;

    constructor(options: DAppKitOptions) {
        if (options.logLevel) {
            DAppKitLogger.configure(options.logLevel);
            DAppKitLogger.debug('DAppKit', 'constructor', options);
        }

        const client = new HttpClient(options.nodeUrl);

        const thorClient = new ThorClient(client);
        const walletManager = new WalletManager(options, thorClient);
        const providerWallet = new ProviderWallet(walletManager);

        this.thor = thorClient;
        this.wallet = walletManager;
        this.provider = new EthersProvider(thorClient, providerWallet);
    }
}

export { DAppKit };

import { HttpClient, ThorClient, VechainProvider } from '@vechain/sdk-network';
import { WalletManager } from './classes';
import { DAppKitLogger } from './utils';
import type { DAppKitOptions } from './types';
import { ProviderWallet } from './classes/provider-wallet';

class DAppKit {
    public readonly thor: ThorClient;
    public readonly wallet: WalletManager;
    public readonly provider: VechainProvider;

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
        this.provider = new VechainProvider(thorClient, providerWallet);
    }
}

export { DAppKit };

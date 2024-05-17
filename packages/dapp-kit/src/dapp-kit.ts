import { WalletManager } from './classes';
import { DAppKitLogger } from './utils';
import type { DAppKitOptions } from './types';
import { HttpClient, ThorClient as SDKClient } from '@vechain/sdk-network';
import { ThorClient } from './types/types';

class DAppKit {
    public readonly thor: ThorClient;
    public readonly wallet: WalletManager;

    constructor(options: DAppKitOptions) {
        if (options.logLevel) {
            DAppKitLogger.configure(options.logLevel);
            DAppKitLogger.debug('DAppKit', 'constructor', options);
        }

        const client = new HttpClient(options.nodeUrl);
        const thorClient = new SDKClient(client);
        const walletManager = new WalletManager(options, thorClient);

        this.thor = thorClient;
        this.wallet = walletManager;
    }
}

export { DAppKit };

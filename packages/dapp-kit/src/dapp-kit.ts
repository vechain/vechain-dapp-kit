import { ThorClient } from '@vechain/sdk-network';
import { WalletManager } from './classes';
import { DAppKitLogger } from './utils';
import type { DAppKitOptions } from './types';

class DAppKit {
    public readonly thor: ThorClient;
    public readonly wallet: WalletManager;

    constructor(options: DAppKitOptions) {
        if (options.logLevel) {
            DAppKitLogger.configure(options.logLevel);
            DAppKitLogger.debug('DAppKit', 'constructor', options);
        }

        const { nodeUrl } = options;
        const walletManager = new WalletManager(options);

        this.thor = ThorClient.fromUrl(nodeUrl);
        this.wallet = walletManager;
    }
}

export { DAppKit };

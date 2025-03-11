import { ThorClient, VeChainProvider } from '@vechain/sdk-network';
import { VeChainSignerDAppKit, WalletManager } from './classes';
import { DAppKitLogger } from './utils';
import type { DAppKitOptions } from './types';

class DAppKit {
    public readonly thor: ThorClient;
    public readonly wallet: WalletManager;
    public readonly signer: VeChainSignerDAppKit;

    constructor(options: DAppKitOptions) {
        if (options.logLevel) {
            DAppKitLogger.configure(options.logLevel);
            DAppKitLogger.debug('DAppKit', 'constructor', options);
        }

        const { node } = options;
        if (typeof node === 'string') {
            this.thor = ThorClient.at(node);
        } else {
            this.thor = new ThorClient(node);
        }
        this.wallet = new WalletManager(options, this.thor);
        this.signer = new VeChainSignerDAppKit(
            this.wallet,
            new VeChainProvider(this.thor),
        );
    }
}

export { DAppKit };

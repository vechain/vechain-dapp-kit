import { ThorClient, VeChainProvider } from '@vechain/sdk-network';
import { VeChainSignerDAppKit, WalletManager } from './classes';
import type { DAppKitOptions } from './types';
import { DAppKitLogger } from './utils';

class DAppKit {
    public readonly thor: ThorClient;
    public readonly wallet: WalletManager;
    public readonly signer: VeChainSignerDAppKit;
    public readonly options: DAppKitOptions;

    constructor(options: DAppKitOptions) {
        this.options = options;
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

    async initialize() {
        if (!this.options.supportNewMethods) {
            DAppKitLogger.debug(
                'DAppKit',
                'initialize',
                'tried to call DAppKit.initialize when supportNewMethods is set to off. Skipping',
            );
            return;
        }
        await this.wallet.initializeStateAsync();
    }
}

export { DAppKit };

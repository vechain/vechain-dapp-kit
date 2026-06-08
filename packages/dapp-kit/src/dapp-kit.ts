import { ThorClient, VeChainProvider } from '@vechain/sdk-network';
import { VeChainSignerDAppKit, WalletManager } from './classes';
import type { DAppKitOptions, NormalizedDAppKitOptions } from './types';
import { DAppKitLogger } from './utils';

class DAppKit {
    public readonly thor: ThorClient;
    public readonly wallet: WalletManager;
    public readonly signer: VeChainSignerDAppKit;
    public readonly options: NormalizedDAppKitOptions;

    constructor(options: DAppKitOptions) {
        this.options = {
            ...options,
            v2Api: {
                enabled: true,
                ...options.v2Api,
            },
        };
        if (this.options.logLevel) {
            DAppKitLogger.configure(this.options.logLevel);
            DAppKitLogger.debug('DAppKit', 'constructor', this.options);
        }

        const { node } = this.options;
        if (typeof node === 'string') {
            this.thor = ThorClient.at(node);
        } else {
            this.thor = new ThorClient(node);
        }
        this.wallet = new WalletManager(this.options, this.thor);
        this.signer = new VeChainSignerDAppKit(
            this.wallet,
            new VeChainProvider(this.thor),
        );
    }

    async initialize() {
        if (!this.options.v2Api.enabled) {
            DAppKitLogger.debug(
                'DAppKit',
                'initialize',
                'tried to call DAppKit.initialize when supportNewMethods is set to off. Skipping',
            );
            return;
        }
        await this.wallet.initializeStateAsync();
        await this.wallet.populateAvailableMethods();
    }
}

export { DAppKit };

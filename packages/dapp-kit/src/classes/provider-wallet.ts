import type {
    ProviderInternalWallet,
    VechainProvider,
    VechainSigner,
} from '@vechain/sdk-network';
import { WalletManager } from './wallet-manager';
import { DAppKitSigner } from './provider-signer';

interface WalletAccount {
    address: string;
}

interface DelegationOptions {
    delegatorUrl: string;
}

/**
 * Basic vechain signer.
 * This signer can be initialized using a private key.
 */
class ProviderWallet implements ProviderInternalWallet {
    get accounts(): WalletAccount[] {
        const connectedAccount = this.wallet.state.address;

        if (connectedAccount)
            return [
                {
                    address: connectedAccount,
                },
            ];

        return [];
    }

    constructor(
        private readonly wallet: WalletManager,
        private delegationOptions?: DelegationOptions,
    ) {
        this.delegationOptions = delegationOptions;
    }

    async getAccount(): Promise<WalletAccount | null> {
        const addr = this.wallet.state.address;

        if (!addr) {
            const res = await this.wallet.connect();
            return {
                address: res.account,
            };
        }

        return {
            address: addr,
        };
    }

    async getAddresses(): Promise<string[]> {
        const addr = this.wallet.state.address;

        if (addr) return [addr];

        const res = await this.wallet.connect();
        return [res.account];
    }

    setDelegator(options: DelegationOptions): void {
        this.delegationOptions = options;
    }

    private async connect(addr?: string): Promise<string> {
        const currentAddress = this.wallet.state.address;

        if (currentAddress === addr) {
            return addr;
        }

        const res = await this.wallet.connect(addr);
        return res.account;
    }

    getDelegator(): Promise<DelegationOptions | null> {
        return Promise.resolve(this.delegationOptions ?? null);
    }

    async getSigner(
        parentProvider: VechainProvider,
        address: string,
    ): Promise<VechainSigner | null> {
        const account = await this.connect(address);

        return new DAppKitSigner(parentProvider, this.wallet, account);
    }
}

export { ProviderWallet };

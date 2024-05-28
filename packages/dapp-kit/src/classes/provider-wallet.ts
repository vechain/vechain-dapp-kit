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
        private readonly delegationOptions?: DelegationOptions,
    ) {
        this.delegationOptions = delegationOptions;
    }

    getAccount(): Promise<WalletAccount | null> {
        const addr = this.wallet.state.address;

        if (!addr) {
            return Promise.resolve(null);
        }

        return Promise.resolve({
            address: addr,
        });
    }

    getAddresses(): Promise<string[]> {
        const addr = this.wallet.state.address;

        const addresses = [];

        if (addr) addresses.push(addr);

        return Promise.resolve(addresses);
    }

    getDelegator(): Promise<DelegationOptions | null> {
        return Promise.resolve(this.delegationOptions ?? null);
    }

    getSigner(
        parentProvider: VechainProvider,
        addressOrIndex?: string | number,
    ): Promise<VechainSigner> {
        return Promise.resolve(
            this.getSignerSync(parentProvider, addressOrIndex),
        );
    }

    getSignerSync(
        parentProvider: VechainProvider,
        addressOrIndex?: string | number,
    ): VechainSigner {
        if (typeof addressOrIndex === 'string') {
            return new DAppKitSigner(
                parentProvider,
                this.wallet,
                addressOrIndex,
            );
        }

        return new DAppKitSigner(parentProvider, this.wallet);
    }
}

export { ProviderWallet };

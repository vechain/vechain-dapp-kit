import {
    ProviderInternalWallet,
    ProviderInternalWalletAccount,
    SignTransactionOptions,
    VeChainProvider,
    VeChainSigner,
} from '@vechain/sdk-network';
import { WalletManager } from './wallet-manager';
import { DAppKitSigner } from './provider-signer';

interface DelegationOptions {
    delegatorUrl: string;
}

/**
 * Basic vechain signer.
 * This signer can be initialized using a private key.
 */
class ProviderWallet implements ProviderInternalWallet {
    constructor(
        private readonly wallet: WalletManager,
        private readonly delegationOptions?: DelegationOptions,
    ) {
        this.delegationOptions = delegationOptions;
    }

    get accounts(): ProviderInternalWalletAccount[] {
        const connectedAccount = this.account;

        if (connectedAccount)
            return [
                {
                    address: connectedAccount,
                },
            ];

        return [];
    }

    private get account(): `0x${string}` | null {
        return this.wallet.state.address as `0x${string}` | null;
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
        parentProvider: VeChainProvider,
        addressOrIndex?: string | number,
    ): Promise<VeChainSigner> {
        return Promise.resolve(
            this.getSignerSync(parentProvider, addressOrIndex),
        );
    }

    getSignerSync(
        parentProvider: VeChainProvider,
        addressOrIndex?: string | number,
    ): VeChainSigner {
        if (typeof addressOrIndex === 'string') {
            return new DAppKitSigner(
                parentProvider,
                this.wallet,
                addressOrIndex,
            );
        }

        return new DAppKitSigner(parentProvider, this.wallet);
    }

    getAccount(
        addressOrIndex: string | number | undefined,
    ): Promise<ProviderInternalWalletAccount | null> {
        return Promise.resolve(this.getAccountSync(addressOrIndex));
    }

    getAccountSync(
        addressOrIndex: string | number | undefined,
    ): ProviderInternalWalletAccount | null {
        if (typeof addressOrIndex === 'string') {
            return (
                this.accounts.find(
                    (account) => account.address === addressOrIndex,
                ) ?? null
            );
        }

        return this.accounts[0] ?? null;
    }

    getAddressesSync(): string[] {
        const address = this.account;

        if (address) return [address];

        return [];
    }

    getDelegatorSync(): SignTransactionOptions | null {
        return null;
    }
}

export { ProviderWallet };

import type { ConnexOptions, ConnexSigner } from './types';
import { WalletSource } from './wallet';
import { createSigner } from './signer';

class SignerManager implements ConnexSigner {
    private signers: Record<WalletSource, ConnexSigner | undefined> = {
        [WalletSource.WalletConnect]: undefined,
        [WalletSource.VeWorldExtension]: undefined,
        [WalletSource.Sync]: undefined,
        [WalletSource.Sync2]: undefined,
    };

    private currentSource: WalletSource | undefined;

    constructor(
        private readonly connexOptions: ConnexOptions,
        initialSource?: WalletSource,
    ) {
        this.currentSource = initialSource;
    }

    public setSigner(source: WalletSource): void {
        this.currentSource = source;
    }

    public async disconnect(): Promise<void> {
        if (!this.currentSource) {
            return;
        }

        const signer = this.signers[this.currentSource];

        if (signer) {
            await signer.disconnect?.();
        }
    }

    async signTx(
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> {
        const signer = await this.getSigner();

        return signer.signTx(msg, options);
    }

    public async signCert(
        msg: Connex.Vendor.CertMessage,
        options: Connex.Signer.CertOptions,
    ): Promise<Connex.Vendor.CertResponse> {
        const signer = await this.getSigner();

        return signer.signCert(msg, options);
    }

    private async getSigner(): Promise<ConnexSigner> {
        if (!this.currentSource) {
            throw new Error('No wallet has been selected');
        }

        let signer = this.signers[this.currentSource];

        if (!signer) {
            const opts = { ...this.connexOptions, source: this.currentSource };
            const newSigner = createSigner(opts);

            if (newSigner) {
                signer = await newSigner;
                this.signers[this.currentSource] = signer;
            }
        }

        if (!signer) {
            throw new Error('Signer is not initialized');
        }

        return signer;
    }
}

export { SignerManager };

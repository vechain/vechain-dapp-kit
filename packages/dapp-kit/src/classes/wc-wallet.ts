import type { ConnectResponse, VechainWallet, WCSigner } from '../types';
import type {
    CertificateMessage,
    CertificateOptions,
    CertificateResponse,
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
} from '../types/requests';

class WCWallet implements VechainWallet {
    constructor(private readonly signer: WCSigner) {}

    connect = async (): Promise<ConnectResponse> => {
        const account = await this.signer.connect();

        return {
            account,
            verified: false,
        };
    };

    signCert = (
        msg: CertificateMessage,
        options: CertificateOptions,
    ): Promise<CertificateResponse> => this.signer.signCert(msg, options);

    signTx = (
        msg: TransactionMessage[],
        options: TransactionOptions,
    ): Promise<TransactionResponse> => this.signer.signTx(msg, options);

    disconnect = (): Promise<void> => this.signer.disconnect();
}

export { WCWallet };

import type {
    CertificateResponse,
    CertMessage,
    CertOptions,
    ConnectResponse,
    ExtendedClause,
    RemoteWallet,
    SendTxOptions,
    WalletTransactionResponse,
    WCSigner,
} from '../types';

class WCWallet implements RemoteWallet {
    constructor(private readonly signer: WCSigner) {}

    connect = async (account?: string): Promise<ConnectResponse> =>
        this.signer.connect(account);

    signCert = (
        msg: CertMessage,
        options: CertOptions = {},
    ): Promise<CertificateResponse> => this.signer.signCert(msg, options);

    signTx = (
        msg: ExtendedClause[],
        options: SendTxOptions = {},
    ): Promise<WalletTransactionResponse> => this.signer.signTx(msg, options);

    disconnect = (): Promise<void> => this.signer.disconnect();
}

export { WCWallet };

import type {
    CertMessage,
    CertOptions,
    ConnectResponse,
    ExtendedClause,
    RemoteWallet,
    SendTxOptions,
    SendTxResponse,
    WCSigner,
} from '../types';

class WCWallet implements RemoteWallet {
    constructor(private readonly signer: WCSigner) {}

    connect = async (): Promise<ConnectResponse> => {
        const account = await this.signer.connect();

        return {
            account,
            verified: false,
        };
    };

    signCert = (msg: CertMessage, options: CertOptions) =>
        this.signer.signCert(msg, options);

    signTx = (
        msg: ExtendedClause[],
        options: SendTxOptions,
    ): Promise<SendTxResponse> => this.signer.signTx(msg, options);

    disconnect = (): Promise<void> => this.signer.disconnect();
}

export { WCWallet };

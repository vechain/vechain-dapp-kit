import type { ConnectResponse, ConnexWallet, WCSigner } from '../types';

class WCWallet implements ConnexWallet {
    constructor(private readonly signer: WCSigner) {}

    connect = async (): Promise<ConnectResponse> => {
        const account = await this.signer.connect();

        return {
            account,
            verified: false,
        };
    };

    signCert = (
        msg: Connex.Vendor.CertMessage,
        options: Connex.Signer.CertOptions,
    ): Promise<Connex.Vendor.CertResponse> =>
        this.signer.signCert(msg, options);

    signTx = (
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> => this.signer.signTx(msg, options);

    disconnect = (): Promise<void> => this.signer.disconnect();
}

export { WCWallet };

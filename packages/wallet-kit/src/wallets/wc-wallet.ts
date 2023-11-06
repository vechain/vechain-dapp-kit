import type { WCSigner } from '@vechain/wallet-connect';
import type { ConnectResponse, ConnexWallet } from '../types';
import { DEFAULT_SIGN_IN_MESSAGE } from '../certificates';

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

    signIn = (
        msg?: Connex.Vendor.CertMessage | undefined,
        options?: Connex.Signer.CertOptions | undefined,
    ): Promise<Connex.Vendor.CertResponse> => {
        const _msg = msg || DEFAULT_SIGN_IN_MESSAGE;
        const _options = options || {};

        return this.signCert(_msg, _options);
    };

    signTx = (
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> => this.signer.signTx(msg, options);

    disconnect = (): Promise<void> => this.signer.disconnect();
}

export { WCWallet };

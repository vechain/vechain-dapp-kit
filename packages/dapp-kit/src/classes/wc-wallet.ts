import { ethers } from 'ethers';
import type { ConnectResponse, VechainWallet, WCSigner } from '../types';

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
        msg: Connex.Vendor.CertMessage,
        options: Connex.Signer.CertOptions,
    ): Promise<Connex.Vendor.CertResponse> =>
        this.signer.signCert(msg, options);

    signTx = (
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> => this.signer.signTx(msg, options);

    signTypedData = (
        _domain: ethers.TypedDataDomain,
        _types: Record<string, ethers.TypedDataField[]>,
        _value: Record<string, unknown>,
    ): Promise<string> => {
        return this.signer.signTypedData(_domain, _types, _value);
    };

    disconnect = (): Promise<void> => this.signer.disconnect();
}

export { WCWallet };

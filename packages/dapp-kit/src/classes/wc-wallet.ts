import { ethers } from 'ethers';
import type { ConnectResponse, ConnexWallet, WCSigner } from '../types';
import { SignTypedDataOptions } from '../types/types';

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

    signTypedData = async (
        _domain: ethers.TypedDataDomain,
        _types: Record<string, ethers.TypedDataField[]>,
        _value: Record<string, unknown>,
        _options?: SignTypedDataOptions,
    ): Promise<string> =>
        this.signer.signTypedData(_domain, _types, _value, _options);

    disconnect = (): Promise<void> => this.signer.disconnect();
}

export { WCWallet };

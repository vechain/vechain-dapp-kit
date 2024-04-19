import type { ConnectResponse, ConnexWallet } from '../types';

export class VeWorldWallet implements ConnexWallet {
    constructor(private readonly genesisId: string) {}
    connect = async (): Promise<ConnectResponse> => {
        try {
            const connectedAccounts = (await window.vechain?.request({
                method: 'eth_requestAccounts',
            })) as string[];
            return {
                account: connectedAccounts[0],
                verified: true,
            };
        } catch (e) {
            return {
                account: '',
                verified: false,
            };
        }
    };

    signCert = (
        msg: Connex.Vendor.CertMessage,
        options: Connex.Signer.CertOptions,
    ): Promise<Connex.Vendor.CertResponse> => {
        if (!window.vechain) {
            throw new Error('VeChain not found');
        }
        return window.vechain.request({
            method: 'thor_signCertificate',
            params: [msg, options, this.genesisId],
        }) as Promise<Connex.Vendor.CertResponse>;
    };

    signTx = (
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> => {
        if (!window.vechain) {
            throw new Error('VeChain not found');
        }
        return window.vechain.request({
            method: 'thor_sendTransaction',
            params: [msg, options, this.genesisId],
        }) as Promise<Connex.Vendor.TxResponse>;
    };

    disconnect = async (): Promise<void> => {
        // TODO
    };
}

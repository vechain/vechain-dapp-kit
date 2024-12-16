/**
 * The methods supported by the WalletConnect integration
 * @param RequestTransaction - Request the wallet to send a transaction
 * @param SignCertificate - Request the wallet to sign a certificate
 */
export enum DefaultMethods {
    RequestTransaction = 'thor_sendTransaction',
    SignCertificate = 'thor_signCertificate',
    SignTypedData = 'thor_signTypedData',
}

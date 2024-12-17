import {
    Address,
    Certificate,
    CertificateData,
    HDKey,
    Hex,
} from '@vechain/sdk-core';

const mnemonicWords =
    'denial kitchen pet squirrel other broom bar gas better priority spoil cross';

const hdNode = HDKey.fromMnemonic(mnemonicWords.split(' '));

const firstAccount = hdNode.deriveChild(0);

const privateKey = firstAccount.privateKey!;
const address = Address.ofPrivateKey(privateKey);

const mockedConnexSigner = {
    signTx() {
        return Promise.resolve({ txid: '0x1234', signer: address.toString() });
    },

    signCert(msg: any) {
        const newCertificate: CertificateData = {
            domain: ' localhost:3000',
            timestamp: 12341234,
            signer: address.toString(),
            payload: msg.payload,
            purpose: msg.purpose,
        };

        const signature =
            Certificate.of(newCertificate).sign(privateKey).signature;

        return Promise.resolve({
            annex: {
                domain: newCertificate.domain,
                timestamp: newCertificate.timestamp,
                signer: newCertificate.signer,
            },
            signature: Hex.of(signature!).toString(),
        });
    },
};

export { mockedConnexSigner, hdNode, mnemonicWords, privateKey, address };

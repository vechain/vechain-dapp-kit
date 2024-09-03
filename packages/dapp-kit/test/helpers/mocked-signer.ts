/// <reference types="@vechain/connex" />
import {
    type Certificate,
    certificate,
    addressUtils,
    blake2b256,
    HDNode,
    secp256k1,
    Hex,
} from '@vechain/sdk-core';

const mnemonicWords =
    'denial kitchen pet squirrel other broom bar gas better priority spoil cross';

const hdNode = HDNode.fromMnemonic(mnemonicWords.split(' '));

const firstAccount = hdNode.deriveChild(0);

const privateKey = firstAccount.privateKey!;
const address = addressUtils.fromPrivateKey(privateKey);

const mockedConnexSigner: Connex.Signer = {
    signTx() {
        return Promise.resolve({ txid: '0x1234', signer: address });
    },

    signCert(msg) {
        // Init the certificate object
        const newCertificate: Certificate = {
            domain: ' localhost:3000',
            timestamp: 12341234,
            signer: address,
            payload: msg.payload,
            purpose: msg.purpose,
        };

        // Encode the certificate to hash
        const encodedCertificateToHash = certificate.encode(newCertificate);

        // Sign the certificate
        const signatureCore = Buffer.from(
            secp256k1.sign(
                blake2b256(encodedCertificateToHash, 'buffer'),
                privateKey,
            ),
        );

        return Promise.resolve({
            annex: {
                domain: newCertificate.domain,
                timestamp: newCertificate.timestamp,
                signer: newCertificate.signer,
            },
            signature: Hex.of(signatureCore).toString(),
        });
    },
};

export { mockedConnexSigner, hdNode, mnemonicWords, privateKey, address };

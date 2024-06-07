/// <reference types="@vechain/connex" />
import { Certificate } from 'thor-devkit';
import {
    addressUtils,
    blake2b256,
    HDNode,
    Hex0x,
    secp256k1,
} from '@vechain/sdk-core';

const mnemonicWords =
    'denial kitchen pet squirrel other broom bar gas better priority spoil cross';

const hdNode = HDNode.fromMnemonic(mnemonicWords.split(' '));

const firstAccount = hdNode.derive('m/0');

const privateKey = firstAccount.privateKey!;
const address = addressUtils.fromPrivateKey(privateKey);

const mockedConnexSigner: Connex.Signer = {
    signTx() {
        return Promise.resolve({ txid: '0x1234', signer: address });
    },

    signCert(msg) {
        // Init the certificate object
        const certificate: Certificate = {
            domain: ' localhost:3000',
            timestamp: 12341234,
            signer: address,
            payload: msg.payload,
            purpose: msg.purpose,
        };

        // Encode the certificate to hash
        const encodedCertificateToHash = new TextEncoder().encode(
            Certificate.encode(certificate).normalize(),
        );

        // Sign the certificate
        const signatureCore = Buffer.from(
            secp256k1.sign(blake2b256(encodedCertificateToHash), privateKey),
        );

        return Promise.resolve({
            annex: {
                domain: certificate.domain,
                timestamp: certificate.timestamp,
                signer: certificate.signer,
            },
            signature: Hex0x.of(signatureCore),
        });
    },
};

export { mockedConnexSigner, hdNode, mnemonicWords, privateKey, address };

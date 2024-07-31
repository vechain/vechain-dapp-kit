/// <reference types="@vechain/connex" />
import {
    addressUtils,
    blake2b256,
    Certificate,
    HDNode,
    secp256k1,
    certificate,
    Hex0x,
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
        const newCertificate: Certificate = {
            domain: ' localhost:3000',
            timestamp: 12341234,
            signer: address,
            payload: msg.payload,
            purpose: msg.purpose,
        };

        const signature = secp256k1.sign(
            blake2b256(certificate.encode(newCertificate)),
            privateKey,
        );

        return Promise.resolve({
            annex: {
                domain: newCertificate.domain,
                timestamp: newCertificate.timestamp,
                signer: newCertificate.signer,
            },
            signature: Hex0x.of(signature),
        });
    },
};

export { mockedConnexSigner, hdNode, mnemonicWords, privateKey, address };

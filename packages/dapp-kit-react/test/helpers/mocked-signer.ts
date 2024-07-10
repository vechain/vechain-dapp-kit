/// <reference types="@vechain/connex" />
import { blake2b256, Certificate, HDNode, secp256k1 } from 'thor-devkit';
// import { blake2b256 } from '@vechain/sdk-core';

const mnemonicWords =
    'denial kitchen pet squirrel other broom bar gas better priority spoil cross';

const hdNode = HDNode.fromMnemonic(mnemonicWords.split(' '));

const firstAccount = hdNode.derive(0);

const privateKey: Buffer = firstAccount.privateKey!;
const address = firstAccount.address;

const mockedConnexSigner: Connex.Signer = {
    signTx() {
        return Promise.resolve({ txid: '0x1234', signer: address });
    },

    signCert(msg) {
        const certificate: Certificate = {
            domain: ' localhost:3000',
            timestamp: 12341234,
            signer: address,
            payload: msg.payload,
            purpose: msg.purpose,
        };

        const signature = secp256k1.sign(
            blake2b256(Certificate.encode(certificate)),
            privateKey,
        );

        return Promise.resolve({
            annex: {
                domain: certificate.domain,
                timestamp: certificate.timestamp,
                signer: certificate.signer,
            },
            signature: `0x${signature.toString('hex')}`,
        });
    },
};

export { mockedConnexSigner, hdNode, mnemonicWords, privateKey, address };

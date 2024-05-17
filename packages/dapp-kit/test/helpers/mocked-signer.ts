import {
    addressUtils,
    blake2b256,
    certificate,
    Certificate,
    HDNode,
    secp256k1,
} from '@vechain/sdk-core';
import { CertMessage, RemoteWallet } from '../../src';

const mnemonicWords =
    'denial kitchen pet squirrel other broom bar gas better priority spoil cross';

const hdNode = HDNode.fromMnemonic(mnemonicWords.split(' '));

const firstAccount = hdNode.deriveChild(0);

const privateKey: Uint8Array = firstAccount.privateKey!;
const address = addressUtils.fromPublicKey(firstAccount.publicKey!);

const mockedConnexSigner: RemoteWallet = {
    signTx() {
        return Promise.resolve({ txid: '0x1234', signer: address });
    },

    signCert(msg: CertMessage) {
        const cert: Certificate = {
            domain: ' localhost:3000',
            timestamp: 12341234,
            signer: address,
            payload: msg.payload,
            purpose: msg.purpose,
        };

        const signature = secp256k1.sign(
            blake2b256(certificate.encode(cert)),
            privateKey,
        );

        return Promise.resolve({
            annex: {
                domain: cert.domain,
                timestamp: cert.timestamp,
                signer: cert.signer,
            },
            signature: `0x${Buffer.from(signature).toString('hex')}`,
        });
    },
};

export { mockedConnexSigner, hdNode, mnemonicWords, privateKey, address };

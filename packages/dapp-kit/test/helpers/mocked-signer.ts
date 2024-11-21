/// <reference types="@vechain/connex" />
import {
    Address,
    Certificate,
    CertificateData,
    Mnemonic,
} from '@vechain/sdk-core';
import { ExpandedConnexSigner } from '../../src/types/types';

const mnemonicWords =
    'denial kitchen pet squirrel other broom bar gas better priority spoil cross';

const privateKey = Mnemonic.toPrivateKey(mnemonicWords.split(' '));
const address = Address.ofPrivateKey(privateKey).toString();

const mockedConnexSigner: ExpandedConnexSigner = {
    signTx() {
        return Promise.resolve({ txid: '0x1234', signer: address });
    },

    signCert(msg) {
        // Init the certificate object
        const newCertificate: CertificateData = {
            domain: ' localhost:3000',
            timestamp: 12341234,
            signer: address,
            payload: msg.payload,
            purpose: msg.purpose,
        };

        const signedCertificate =
            Certificate.of(newCertificate).sign(privateKey);

        return Promise.resolve({
            annex: {
                domain: newCertificate.domain,
                timestamp: newCertificate.timestamp,
                signer: newCertificate.signer,
            },
            signature: signedCertificate.signature || '',
        });
    },

    signTypedData() {
        return Promise.resolve('0x1234');
    },
};

export { address, mnemonicWords, mockedConnexSigner, privateKey };

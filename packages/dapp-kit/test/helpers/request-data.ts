import { CertificateMessage } from '../../src';

export const certMessage: CertificateMessage = {
    purpose: 'identification',
    payload: {
        type: 'text',
        content: 'Hello World',
    },
};

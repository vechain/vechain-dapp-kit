import { CertMessage } from '../../src';

export const certMessage: CertMessage = {
    purpose: 'identification',
    payload: {
        type: 'text',
        content: 'Hello World',
    },
};

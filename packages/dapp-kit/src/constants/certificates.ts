import { CertMessage } from '../types';

const DEFAULT_CONNECT_CERT_MESSAGE: CertMessage = {
    purpose: 'identification',
    payload: {
        type: 'text',
        content: `The following dApp would like to see your public address: ${
            typeof window !== 'undefined' ? window.origin : ''
        }`,
    },
};

export { DEFAULT_CONNECT_CERT_MESSAGE };

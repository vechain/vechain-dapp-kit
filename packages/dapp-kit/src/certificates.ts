const DEFAULT_CONNECT_CERT_MESSAGE: Connex.Vendor.CertMessage = {
    purpose: 'identification',
    payload: {
        type: 'text',
        content: `The following dApp would like to see your public address: ${window.origin}`,
    },
};

const DEFAULT_SIGN_IN_MESSAGE: Connex.Vendor.CertMessage = {
    purpose: 'identification',
    payload: {
        type: 'text',
        content: `Sign in to: ${window.origin}`,
    },
};

export { DEFAULT_SIGN_IN_MESSAGE, DEFAULT_CONNECT_CERT_MESSAGE };

const DEFAULT_CONNECT_CERT_MESSAGE: Connex.Vendor.CertMessage = {
    purpose: 'identification',
    payload: {
        type: 'text',
        content: `The following dApp would like to see your public address: ${window.origin}`,
    },
};

export { DEFAULT_CONNECT_CERT_MESSAGE };

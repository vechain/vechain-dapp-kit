import {
    AddressButton,
    AddressModal,
    ConnectButton,
    ConnectModal,
    SourceCard,
} from '../../src';

const performQueryWithTimeout = async <T>(
    timeout: number,
    query: () => T | undefined | null,
): Promise<T | undefined | null> => {
    const startTime = Date.now();

    let element = query();

    while (!element && Date.now() - startTime < timeout) {
        await new Promise((resolve) => setTimeout(resolve, 10));
        element = query();
    }

    return element;
};

const getConnectButton = (
    timeout = 2000,
): Promise<ConnectButton | undefined | null> => {
    return performQueryWithTimeout(timeout, () =>
        window.document.body
            .querySelector('vdk-button')
            ?.shadowRoot?.querySelector('vdk-connect-button'),
    );
};

const getAddressButton = (
    timeout = 2000,
): Promise<AddressButton | undefined | null> => {
    return performQueryWithTimeout(timeout, () =>
        window.document.body
            .querySelector('vdk-button')
            ?.shadowRoot?.querySelector('vdk-address-button'),
    );
};

const getConnectModal = (): Promise<ConnectModal | undefined | null> => {
    return performQueryWithTimeout(2000, () =>
        window.document.body
            .querySelector('vdk-modal')
            ?.shadowRoot?.querySelector('vdk-connect-modal'),
    );
};

const getAddressModal = (
    timeout = 2000,
): Promise<AddressModal | undefined | null> => {
    return performQueryWithTimeout(timeout, () =>
        window.document.body
            .querySelector('vdk-modal')
            ?.shadowRoot?.querySelector('vdk-address-modal'),
    );
};

const getAllSourceCards = async (): Promise<SourceCard[]> => {
    const res = await performQueryWithTimeout(2000, () =>
        window.document.body
            .querySelector('vdk-modal')
            ?.shadowRoot?.querySelector('vdk-connect-modal')
            ?.shadowRoot?.querySelector('vdk-base-modal')
            ?.querySelectorAll('vdk-source-card'),
    );

    const sourceCards: SourceCard[] = [];

    res?.forEach((sourceCard) => {
        sourceCards.push(sourceCard);
    });

    return sourceCards;
};

const getWalletConnectQrCode = () => {
    return performQueryWithTimeout(2000, () =>
        window.document.body
            .querySelector('vdk-modal')
            ?.shadowRoot?.querySelector('vdk-connect-modal')
            ?.shadowRoot?.querySelector('vdk-base-modal')
            ?.querySelector('vdk-wallet-connect-qrcode'),
    );
};

export const elementQueries = {
    getConnectButton,
    getConnectModal,
    getAllSourceCards,
    getWalletConnectQrCode,
    getAddressButton,
    getAddressModal,
};

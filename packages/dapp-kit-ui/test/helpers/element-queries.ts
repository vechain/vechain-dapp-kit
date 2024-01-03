import {
    AddressButton,
    AddressButtonWithModal,
    AddressModal,
    ConnectButton,
    ConnectModal,
    DappKitContextProvider,
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
            .querySelector('vwk-connect-button-with-modal')
            ?.shadowRoot?.querySelector('vwk-connect-button'),
    );
};

const getConnectModal = (): Promise<ConnectModal | undefined | null> => {
    return performQueryWithTimeout(2000, () =>
        window.document.body
            .querySelector('vwk-connect-button-with-modal')
            ?.shadowRoot?.querySelector('vwk-connect-modal'),
    );
};

const getConnectedAddressButtonWithModal = (
    timeout = 2000,
): Promise<AddressButtonWithModal | undefined | null> => {
    return performQueryWithTimeout(timeout, () =>
        window.document.body
            .querySelector('vwk-connect-button-with-modal')
            ?.shadowRoot?.querySelector('vwk-address-button-with-modal'),
    );
};

const getDappKitContextProvider = (): Promise<
    DappKitContextProvider | undefined | null
> => {
    return performQueryWithTimeout(2000, () =>
        window.document.body
            .querySelector('vwk-button')
            ?.shadowRoot?.querySelector('dapp-kit-context-provider'),
    );
};

const getConnectedAddressButton = (
    timeout = 2000,
): Promise<AddressButton | undefined | null> => {
    return performQueryWithTimeout(timeout, () =>
        window.document.body
            .querySelector('vwk-connect-button-with-modal')
            ?.shadowRoot?.querySelector('vwk-address-button-with-modal')
            ?.shadowRoot?.querySelector('vwk-address-button'),
    );
};

const getConnectedAddressModal = (
    timeout = 2000,
): Promise<AddressModal | undefined | null> => {
    return performQueryWithTimeout(timeout, () =>
        window.document.body
            .querySelector('vwk-connect-button-with-modal')
            ?.shadowRoot?.querySelector('vwk-address-button-with-modal')
            ?.shadowRoot?.querySelector('vwk-address-modal'),
    );
};

const getAllSourceCards = async (): Promise<SourceCard[]> => {
    const res = await performQueryWithTimeout(2000, () =>
        window.document.body
            .querySelector('vwk-connect-button-with-modal')
            ?.shadowRoot?.querySelector('vwk-connect-modal')
            ?.shadowRoot?.querySelector('vwk-base-modal')
            ?.querySelectorAll('vwk-source-card'),
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
            .querySelector('vwk-connect-button-with-modal')
            ?.shadowRoot?.querySelector('vwk-connect-modal')
            ?.shadowRoot?.querySelector('vwk-base-modal')
            ?.querySelector('vwk-wallet-connect-qrcode'),
    );
};

export const elementQueries = {
    getConnectButton,
    getConnectModal,
    getAllSourceCards,
    getWalletConnectQrCode,
    getConnectedAddressButtonWithModal,
    getConnectedAddressButton,
    getConnectedAddressModal,
    getDappKitContextProvider,
};

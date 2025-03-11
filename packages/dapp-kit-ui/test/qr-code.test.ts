import { beforeEach, describe, expect, it } from 'vitest';
import {
    Button,
    ConnectButton,
    DAppKitUI,
    dispatchCustomEvent,
    WalletConnectQrCode,
} from '../src';
import { elementQueries } from './helpers/element-queries';

const sampleUri =
    'wc:59f6594baa77ca343197f60436e5a188708b045e323aa4d6ce93722772e18deb@2?relay-protocol=irn&symKey=0422890abbd3baf75cefad89e822b01071cd906705d6c9282596de866376a824';

describe('qr-code-modal', () => {
    beforeEach(() => {
        DAppKitUI.configure({
            node: 'https://mainnet.vechain.org/',
            walletConnectOptions: {
                projectId: '123',
                metadata: {
                    name: 'VeChain',
                    description: 'VeChain',
                    icons: ['https://vechain.org/images/logo.svg'],
                    url: 'https://vechain.org',
                },
            },
        });
    });

    it('should display QR code', async () => {
        const button: Button = window.document.createElement('vdk-button');

        window.document.body.appendChild(button);

        const connectButton =
            (await elementQueries.getConnectButton()) as ConnectButton;

        connectButton.shadowRoot?.querySelector('button')?.click();

        dispatchCustomEvent('vdk-open-wc-qrcode', { uri: sampleUri });

        const qrCode =
            (await elementQueries.getWalletConnectQrCode()) as WalletConnectQrCode;

        expect(qrCode).toBeDefined();

        expect(qrCode.walletConnectQRcode).toBe(sampleUri);
    });
});

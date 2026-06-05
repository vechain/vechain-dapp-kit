import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccountCard, AddressModal, DAppKitUI } from '../src';

const ACCOUNT_A = '0x1111111111111111111111111111111111111111';
const ACCOUNT_B = '0x2222222222222222222222222222222222222222';

const createAddressModal = (): AddressModal => {
    const modal = window.document.createElement(
        'vdk-address-modal',
    ) as AddressModal;
    modal.open = true;
    modal.address = ACCOUNT_A;
    window.document.body.appendChild(modal);
    return modal;
};

describe('vdk-address-modal account manager', () => {
    beforeEach(() => {
        window.document.body.innerHTML = '';
        DAppKitUI.configure({
            node: 'https://mainnet.vechain.org/',
            v2Api: { enabled: true },
        });
    });

    it('renders one card per VeWorld account and switches the active one on click', async () => {
        const onSelectAccount = vi.fn();
        const modal = createAddressModal();
        modal.source = 'veworld';
        modal.availableMethods = [
            'wallet_requestPermissions',
            'wallet_revokeAccountPermission',
        ];
        modal.addresses = [ACCOUNT_A, ACCOUNT_B];
        modal.onSelectAccount = onSelectAccount;
        await modal.updateComplete;

        const cards = Array.from(
            modal.shadowRoot?.querySelectorAll('vdk-account-card') ?? [],
        ) as AccountCard[];
        expect(cards.length).toBe(2);

        const inactiveCard = cards.find((card) => card.address === ACCOUNT_B);
        expect(inactiveCard).toBeTruthy();
        await inactiveCard!.updateComplete;

        inactiveCard!.shadowRoot?.querySelector('button')?.click();
        expect(onSelectAccount).toHaveBeenCalledWith(ACCOUNT_B);
    });

    it('exposes an add-account action for VeWorld when permissions are supported', async () => {
        const onAddAccount = vi.fn();
        const modal = createAddressModal();
        modal.source = 'veworld';
        modal.availableMethods = ['wallet_requestPermissions'];
        modal.addresses = [ACCOUNT_A];
        modal.onAddAccount = onAddAccount;
        await modal.updateComplete;

        const addButton = modal.shadowRoot?.querySelector(
            'button[data-testid="Add account"]',
        ) as HTMLButtonElement | null;
        expect(addButton).toBeTruthy();
        expect(addButton?.querySelector('.add-account-icon svg')).toBeTruthy();
        addButton?.click();
        expect(onAddAccount).toHaveBeenCalled();
    });

    it('does not render the account manager for non-VeWorld wallets', async () => {
        const modal = createAddressModal();
        modal.source = 'wallet-connect';
        modal.availableMethods = [];
        modal.addresses = [ACCOUNT_A, ACCOUNT_B];
        await modal.updateComplete;

        const cards = modal.shadowRoot?.querySelectorAll('vdk-account-card');
        expect(cards?.length ?? 0).toBe(0);

        const disconnect = modal.shadowRoot?.querySelector(
            'button[data-testid="Disconnect"]',
        );
        expect(disconnect).toBeTruthy();
    });
});

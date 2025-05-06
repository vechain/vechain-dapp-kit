import { describe, expect, it, vi } from 'vitest';
import {
    AvailableVeChainProviders,
    TransactionRequestInput,
} from '@vechain/sdk-network';
import { VeChainSignerDAppKit, WalletManager } from '../../src';
import { TransactionBody } from '@vechain/sdk-core';

describe('VeChainSignerDAppKit', () => {
    const mockWallet = {
        signTx: vi.fn().mockResolvedValue({ txid: '0x123' }),
        signTypedData: vi.fn().mockResolvedValue('0x123'),
        state: {
            address: '0x456',
        },
    } as unknown as WalletManager;

    const mockProvider = {
        wallet: {
            getGasPayer: vi.fn().mockResolvedValue({
                delegatorUrl: 'https://example.com',
                delegatorPrivateKey: '0xabc',
            }),
        },
    } as unknown as AvailableVeChainProviders;

    const address = '0x456';

    it('should instantiate with the provided wallet, address, and provider', () => {
        const signer = new VeChainSignerDAppKit(mockWallet, mockProvider);
        expect(signer.address).toBe(address);
        expect(signer.provider).toBe(mockProvider);
    });

    it('should return the address when getAddress is called', async () => {
        const signer = new VeChainSignerDAppKit(mockWallet, mockProvider);
        const result = await signer.getAddress();
        expect(result).toBe(address);
    });

    it('should mock populateTransaction inside signTransaction', async () => {
        const signer = new VeChainSignerDAppKit(mockWallet, mockProvider);

        const transactionToSign = {} as TransactionRequestInput;

        // Mock the populateTransaction method
        const mockPopulatedTransaction: TransactionBody = {
            dependsOn: null,
            expiration: 0,
            gasPriceCoef: 0,
            clauses: [],
            gas: 21000,
            nonce: '0x1',
            blockRef: '0xblockref',
            chainTag: 0x27,
        };
        const populateTransactionSpy = vi
            .spyOn(signer, 'populateTransaction')
            .mockResolvedValue(mockPopulatedTransaction);

        const result = await signer.signTransaction(transactionToSign);

        expect(populateTransactionSpy).toHaveBeenCalledWith(transactionToSign);
        expect(result).toBe('0x123');
    });

    it('should call signTransaction in sendTransaction', async () => {
        const signer = new VeChainSignerDAppKit(mockWallet, mockProvider);

        const transactionToSend = {} as TransactionRequestInput;

        const signTransactionSpy = vi
            .spyOn(signer, 'signTransaction')
            .mockResolvedValue('0x123');

        const result = await signer.sendTransaction(transactionToSend);

        expect(result).toBe('0x123');
        expect(signTransactionSpy).toHaveBeenCalledWith(transactionToSend);
    });

    it('should reject signMessage with "Method not implemented." error', async () => {
        const signer = new VeChainSignerDAppKit(mockWallet, mockProvider);

        await expect(signer.signMessage('message')).rejects.toThrow(
            'Method not implemented.',
        );
    });

    it('should reject signTypedData with "Method not implemented." error', async () => {
        const signer = new VeChainSignerDAppKit(mockWallet, mockProvider);

        const res = await signer.signTypedData(
            {
                name: 'Test Data',
                version: '1',
                chainId: 1,
                verifyingContract: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
            },
            { test: [{ name: 'test', type: 'address' }] },
            { test: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68' },
        );
        expect(res).toBe('0x123');
    });
});

import { describe, it, expect, vi } from 'vitest';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import {
    AvailableVeChainProviders,
    TransactionRequestInput,
} from '@vechain/sdk-network';
import { VechainWallet } from '../../src';
import { VeChainSignerDAppKit } from '../../src/classes/vechain-signer';
import { TransactionBody } from '@vechain/sdk-core';

describe('VeChainSignerDAppKit', () => {
    const mockWallet = {
        signTx: vi.fn().mockResolvedValue({ txid: '0x123' }),
    } as unknown as VechainWallet;

    const mockProvider = {
        wallet: {
            getDelegator: vi.fn().mockResolvedValue({
                delegatorUrl: 'https://example.com',
                delegatorPrivateKey: '0xabc',
            }),
        },
    } as unknown as AvailableVeChainProviders;

    const address = '0x456';

    it('should instantiate with the provided wallet, address, and provider', () => {
        const signer = new VeChainSignerDAppKit(
            mockWallet,
            address,
            mockProvider,
        );
        expect(signer.wallet).toBe(mockWallet);
        expect(signer.address).toBe(address);
        expect(signer.provider).toBe(mockProvider);
    });

    it('should return the address when getAddress is called', async () => {
        const signer = new VeChainSignerDAppKit(
            mockWallet,
            address,
            mockProvider,
        );
        const result = await signer.getAddress();
        expect(result).toBe(address);
    });

    it('should throw an error if provider is null in signTransaction', async () => {
        const signer = new VeChainSignerDAppKit(mockWallet, address, null);

        const transactionToSign = {} as TransactionRequestInput;

        await expect(signer.signTransaction(transactionToSign)).rejects.toThrow(
            JSONRPCInvalidParams,
        );
    });

    it('should mock populateTransaction inside signTransaction', async () => {
        const signer = new VeChainSignerDAppKit(
            mockWallet,
            address,
            mockProvider,
        );

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

    it('should throw an error if provider is null in sendTransaction', async () => {
        const signer = new VeChainSignerDAppKit(mockWallet, address, null);

        const transactionToSend = {} as TransactionRequestInput;

        await expect(signer.sendTransaction(transactionToSend)).rejects.toThrow(
            JSONRPCInvalidParams,
        );
    });

    it('should call signTransaction in sendTransaction', async () => {
        const signer = new VeChainSignerDAppKit(
            mockWallet,
            address,
            mockProvider,
        );

        const transactionToSend = {} as TransactionRequestInput;

        const signTransactionSpy = vi
            .spyOn(signer, 'signTransaction')
            .mockResolvedValue('0x123');

        const result = await signer.sendTransaction(transactionToSend);

        expect(result).toBe('0x123');
        expect(signTransactionSpy).toHaveBeenCalledWith(transactionToSend);
    });

    it('should reject signMessage with "Method not implemented." error', async () => {
        const signer = new VeChainSignerDAppKit(
            mockWallet,
            address,
            mockProvider,
        );

        await expect(signer.signMessage('message')).rejects.toThrow(
            'Method not implemented.',
        );
    });

    it('should reject signTypedData with "Method not implemented." error', async () => {
        const signer = new VeChainSignerDAppKit(
            mockWallet,
            address,
            mockProvider,
        );

        await expect(signer.signTypedData({}, {}, {})).rejects.toThrow(
            'Method not implemented.',
        );
    });
});

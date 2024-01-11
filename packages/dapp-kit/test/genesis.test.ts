import { describe, expect, it } from 'vitest';
import { normalizeGenesisBlock, normalizeGenesisId } from '../src/utils';
import { genesisBlocks } from '../src/constants';

const customBlock = {
    number: 0,
    id: '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
    size: 170,
    parentID:
        '0xffffffff00000000000000000000000000000000000000000000000000000000',
    timestamp: 1526400000,
    gasLimit: 10000000,
    beneficiary: '0x0000000000000000000000000000000000000000',
    gasUsed: 0,
    totalScore: 0,
    txsRoot:
        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    txsFeatures: 0,
    stateRoot:
        '0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550',
    receiptsRoot:
        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    signer: '0x0000000000000000000000000000000000000000',
    isTrunk: true,
    transactions: [],
};

describe('genesis', () => {
    describe('normalizeGenesisId', () => {
        it('normalizes `main`', () => {
            expect(normalizeGenesisId('main')).toBe(genesisBlocks.main.id);
        });

        it('normalizes `test`', () => {
            expect(normalizeGenesisId('test')).toBe(genesisBlocks.test.id);
        });

        it('normalizes a block', () => {
            expect(normalizeGenesisId(customBlock)).toBe(customBlock.id);
        });
    });

    describe('normalizeGenesisBlock', () => {
        it('normalizes `main`', () => {
            expect(normalizeGenesisBlock('main')).toBe(genesisBlocks.main);
        });

        it('normalizes `test`', () => {
            expect(normalizeGenesisBlock('test')).toBe(genesisBlocks.test);
        });

        it('normalizes a block', () => {
            expect(normalizeGenesisBlock(customBlock)).toBe(customBlock);
        });
    });
});

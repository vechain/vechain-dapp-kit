import { describe, expect, it } from 'vitest';
import { normalizeGenesisBlock, normalizeGenesisId } from '../src/utils';
import { genesisBlocks } from '../src/constants';

describe('genesis', () => {
    describe('normalizeGenesisId', () => {
        it('normalizes `main`', () => {
            expect(normalizeGenesisId('main')).toBe(genesisBlocks.main.id);
        });

        it('normalizes `test`', () => {
            expect(normalizeGenesisId('test')).toBe(genesisBlocks.test.id);
        });
    });

    describe('normalizeGenesisBlock', () => {
        it('normalizes `main`', () => {
            expect(normalizeGenesisBlock('main')).toBe(genesisBlocks.main);
        });

        it('normalizes `test`', () => {
            expect(normalizeGenesisBlock('test')).toBe(genesisBlocks.test);
        });
    });
});

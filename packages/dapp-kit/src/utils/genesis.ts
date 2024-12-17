import type { CompressedBlockDetail } from '@vechain/sdk-network';
import { genesisBlocks } from '../constants';
import type { Genesis } from '../types';

const normalizeGenesisId = (genesis?: Genesis): string => {
    if (!genesis) return genesisBlocks.main.id;

    if (genesis === 'main' || genesis === 'test')
        return genesisBlocks[genesis].id;

    return genesis.id;
};

const normalizeGenesisBlock = (genesis?: Genesis): CompressedBlockDetail => {
    if (!genesis) return genesisBlocks.main;

    if (genesis === 'main' || genesis === 'test') return genesisBlocks[genesis];

    return genesis;
};

export { normalizeGenesisId, normalizeGenesisBlock };

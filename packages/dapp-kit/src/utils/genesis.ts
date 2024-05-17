import { genesisBlocks } from '../constants';
import type { Genesis } from '../types';
import { CompressedBlockDetail } from '@vechain/sdk-network';

const normalizeGenesisId = (genesis?: Genesis): string => {
    if (!genesis) return genesisBlocks.main.id;

    return genesisBlocks[genesis].id;
};

const normalizeGenesisBlock = (genesis?: Genesis): CompressedBlockDetail => {
    if (!genesis) return genesisBlocks.main;

    if (genesis === 'main' || genesis === 'test') return genesisBlocks[genesis];

    return genesis;
};

export { normalizeGenesisId, normalizeGenesisBlock };

import type { Connex1 } from '@vechain/connex/esm/signer';

declare global {
    interface Window {
        vechain?: {
            newConnexSigner: (genesisId: string) => Connex.Signer;
        };
        connex?: Connex1;
    }
}

export type Genesis = 'main' | 'test' | Connex.Thor.Block;

import { genesisBlocks } from "@vechain/connex/esm/config";
import type { Genesis } from "./types";

const normalizeGenesisId = (genesis: Genesis): string => {
  if (genesis === "main" || genesis === "test")
    return genesisBlocks[genesis].id;

  return genesis.id;
};

const normalizeGenesisBlock = (genesis: Genesis): Connex.Thor.Block => {
  if (genesis === "main" || genesis === "test") return genesisBlocks[genesis];

  return genesis;
};

export { normalizeGenesisId, normalizeGenesisBlock };

import { kiichainTestnet } from "./chainInfo";

export enum ChainId {
  KII_TESTNET = kiichainTestnet.id,
}

/**
 * Array of all the supported EVM chain IDs
 */
export const chains = [kiichainTestnet] as const;

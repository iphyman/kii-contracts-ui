import {
  abstract,
  AppKitNetwork,
  arbitrum,
  avalanche,
  base,
  blast,
  bsc,
  celo,
  gnosis,
  polygon,
} from "@reown/appkit/networks";

export enum ChainId {
  ABSTRACT = abstract.id,
  ARBITRUM = arbitrum.id,
  AVALANCHE = avalanche.id,
  BASE = base.id,
  BLAST = blast.id,
  BSC = bsc.id,
  CELO = celo.id,
  GNOSIS = gnosis.id,
  POLYGON = polygon.id,
}

/**
 * Array of all the supported EVM chain IDs
 */
export const chains = [
  abstract,
  arbitrum,
  avalanche,
  base,
  blast,
  bsc,
  celo,
  gnosis,
  polygon,
] as [AppKitNetwork, ...AppKitNetwork[]];

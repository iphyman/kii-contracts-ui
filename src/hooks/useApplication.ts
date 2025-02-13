"use client";

import { Abi } from "abitype";
import { useAtom } from "jotai/react";
import { atomWithStorage } from "jotai/utils";
import { Address } from "viem";

export interface ContractStore {
  name?: string;
  address: Address;
  abi: Abi;
  chainId: number;
}

const contractStoreAtom = atomWithStorage<ContractStore[]>(
  "evm-contract-ui-store",
  []
);

export function useApplication() {
  const [contractStore, updateContractStore] = useAtom(contractStoreAtom);

  return {
    contractStore,
    updateContractStore,
  };
}

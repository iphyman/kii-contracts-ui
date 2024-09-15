"use client";

import { QuestionHelper } from "@app/components/QuestionHelper";
import { ContractStore, useApplication } from "@app/hooks";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Abi } from "abitype/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Address, isAddress } from "viem";

export default function View() {
  const { contractStore, updateContractStore } = useApplication();
  const [state, update] = useState<ContractStore>({
    name: "",
    address: "0x",
    abi: [],
  });

  const router = useRouter();

  const isValid = isAddress(state.address) && Abi.safeParse(state.abi).success;

  const handler = () => {
    if (!isValid) return;

    updateContractStore([
      ...contractStore,
      {
        name: state.name,
        address: state.address,
        abi: state.abi,
      },
    ]);
    router.push(`/contract?address=${state.address}`);
  };

  return (
    <VStack w="full">
      <Heading fontSize="2rem">Add Contract From Address</Heading>
      <Text color="whiteAlpha.700">
        You can add an already deployed contract to interact with
      </Text>
      <VStack w="full" mt="4rem" spacing={7}>
        <FormControl>
          <HStack>
            <FormLabel mr="0px">Contract Address</FormLabel>
            <QuestionHelper text="The address of the contract you wish to interact with" />
          </HStack>
          <Input
            placeholder="Contract address"
            onChange={(e) =>
              update((prev) => ({
                ...prev,
                address: e.target.value as Address,
              }))
            }
          />
        </FormControl>
        <FormControl>
          <HStack>
            <FormLabel mr="0px">Contract Name</FormLabel>
            <QuestionHelper text="A name to distinguish this contract with" />
          </HStack>
          <Input
            placeholder="A discriptive name for this contract"
            onChange={(e) =>
              update((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </FormControl>
        <FormControl>
          <HStack>
            <FormLabel mr="0px">Contract ABI</FormLabel>
            <QuestionHelper text="The contract ABI" />
          </HStack>
          <Textarea
            placeholder="Paste the contract ABI"
            onChange={(e) => {
              const parsedAbi = Abi.safeParse(e.target.value);
              if (parsedAbi.success) {
                update((prev) => ({ ...prev, abi: parsedAbi.data }));
              }
            }}
          />
        </FormControl>
        <FormControl>
          <Button colorScheme="teal" isDisabled={!isValid} onClick={handler}>
            Lookup
          </Button>
        </FormControl>
      </VStack>
    </VStack>
  );
}

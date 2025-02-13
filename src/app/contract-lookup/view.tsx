"use client";

import { QuestionHelper } from "@app/components/QuestionHelper";
import { ContractStore, useApplication } from "@app/hooks";
import {
  Button,
  Field,
  Heading,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useAppKitNetwork } from "@reown/appkit/react";
import { Abi } from "abitype/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Address, isAddress } from "viem";

export default function View() {
  const { contractStore, updateContractStore } = useApplication();
  const { chainId } = useAppKitNetwork();
  const [state, update] = useState<ContractStore>({
    name: "",
    address: "0x",
    abi: [],
    chainId: Number(chainId),
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
        chainId: Number(chainId),
      },
    ]);
    router.push(`/contract?address=${state.address}`);
  };

  return (
    <VStack w="full">
      <Heading fontSize="2rem" color="fg">
        Add Contract From Address
      </Heading>
      <Text color="fg.muted">
        You can add an already deployed contract to interact with
      </Text>
      <VStack w="full" mt="4rem" gap={7}>
        <Field.Root>
          <HStack>
            <Field.Label mr="0px">Contract Address</Field.Label>
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
        </Field.Root>
        <Field.Root>
          <HStack>
            <Field.Label mr="0px">Contract Name</Field.Label>
            <QuestionHelper text="A name to distinguish this contract with" />
          </HStack>
          <Input
            placeholder="A discriptive name for this contract"
            onChange={(e) =>
              update((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </Field.Root>
        <Field.Root>
          <HStack>
            <Field.Label mr="0px">Contract ABI</Field.Label>
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
        </Field.Root>
        <Field.Root>
          <Button colorPalette="teal" disabled={!isValid} onClick={handler}>
            Lookup
          </Button>
        </Field.Root>
      </VStack>
    </VStack>
  );
}

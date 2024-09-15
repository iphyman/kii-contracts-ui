"use client";

import { useApplication } from "@app/hooks";
import { Heading, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { FaPlay } from "react-icons/fa6";

export default function View() {
  const searchParams = useSearchParams();
  const { contractStore } = useApplication();

  const contractAddress = searchParams.get("address");
  const activeContract = contractStore.find(
    (p) => p.address.toLowerCase() === contractAddress?.toLowerCase()
  );

  const abiFunctions = activeContract?.abi.filter((p) => p.type === "function");
  const readFunctions = abiFunctions?.filter(
    (p) => p.stateMutability === "view"
  );
  const writeFunctions = abiFunctions?.filter(
    (p) => p.stateMutability === "nonpayable" || p.stateMutability === "payable"
  );

  const contractName =
    !activeContract?.name || activeContract.name.length === 0
      ? "Unknown Contract"
      : activeContract.name;

  return (
    <VStack w="full">
      <Heading fontSize="2rem" textTransform="capitalize">
        {contractName}
      </Heading>
      <Text color="whiteAlpha.700" textAlign="center">
        {`You are ready to interact with ${contractName} deployed on Kiichain
        Testnet at ${activeContract?.address}`}
      </Text>
      <VStack w="full" spacing={7} mt="4rem">
        {readFunctions && (
          <VStack w="full" spacing={7} alignItems="flex-start">
            <Text>Read only functions</Text>
            {readFunctions.map((p) => (
              <HStack spacing={5} key={p.name}>
                <IconButton icon={<FaPlay />} aria-label="call function" />
                <Text fontStyle="italic">{`${p.name} (${p.inputs
                  .map((x) => x.type)
                  .join(",")})`}</Text>
              </HStack>
            ))}
          </VStack>
        )}

        {writeFunctions && (
          <VStack w="full" spacing={7} alignItems="flex-start">
            <Text>Read & Write functions</Text>
            {writeFunctions.map((p) => (
              <HStack spacing={5} key={p.name}>
                <IconButton icon={<FaPlay />} aria-label="call function" />
                <Text fontStyle="italic">{`${p.name} (${p.inputs
                  .map((x) => x.type)
                  .join(",")})`}</Text>
              </HStack>
            ))}
          </VStack>
        )}
      </VStack>
    </VStack>
  );
}

"use client";

import { Heading, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa6";

export default function View() {
  return (
    <VStack w="full">
      <Heading fontSize="2rem">Contract Name</Heading>
      <Text color="whiteAlpha.700">
        You are ready to interact with Contract Name deployed on Kiichain
        Testnet at 0x0000
      </Text>
      <VStack w="full" spacing={7} mt="4rem" alignItems="flex-start">
        <HStack spacing={5}>
          <IconButton icon={<FaPlay />} aria-label="call function" />
          <Text fontStyle="italic">approve</Text>
        </HStack>
      </VStack>
    </VStack>
  );
}

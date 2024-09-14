"use client";

import { Button, Heading, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { BsUpload } from "react-icons/bs";
import { FaChevronRight, FaCode } from "react-icons/fa6";

export default function View() {
  return (
    <VStack w="full">
      <Heading fontSize="2rem">Add New Contract</Heading>
      <Text color="whiteAlpha.700">
        You can deploy and instantiate new contract code, or interact with an
        already existing contract on-chain.
      </Text>
      <VStack w="full" spacing={7} mt="64px">
        <Link href="/instantiate" style={{ width: "100%" }}>
          <Button h="4rem" w="full" px="32px" justifyContent="space-between">
            <HStack w="full" spacing={3}>
              <Icon fontSize="24px" as={BsUpload} />
              <Text>Deploy New Contract Code</Text>
            </HStack>
            <Icon as={FaChevronRight} fontSize="24px" />
          </Button>
        </Link>
        <Link href="/contract-lookup" style={{ width: "100%" }}>
          <Button h="4rem" w="full" px="32px" justifyContent="space-between">
            <HStack w="full" spacing={3}>
              <Icon fontSize="24px" as={FaCode} />
              <Text>Use On-Chain Contract Address</Text>
            </HStack>
            <Icon as={FaChevronRight} fontSize="24px" />
          </Button>
        </Link>
      </VStack>
    </VStack>
  );
}

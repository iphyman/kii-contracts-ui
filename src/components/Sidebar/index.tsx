"use client";

import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import NetworkSelector from "../NetworkSelector";
import Link from "next/link";
import { AiOutlineFileAdd } from "react-icons/ai";
import { IoFileTrayFull } from "react-icons/io5";

export default function Sidebar() {
  return (
    <Box
      w="14rem"
      minH="100%"
      bg="gray.800"
      borderRight="1px solid"
      borderRightColor="whiteAlpha.300"
      padding="12px"
    >
      <VStack w="full" h="full">
        <VStack w=" full" flex={1}>
          <NetworkSelector />
          <VStack w="full" spacing={4} mt="2rem">
            <Link href="/add-contract" style={{ width: "100%" }}>
              <HStack
                color="whiteAlpha.800"
                _hover={{ color: "white" }}
                alignItems="center"
              >
                <Icon as={AiOutlineFileAdd} />
                <Text fontSize="14px">Add New Contract</Text>
              </HStack>
            </Link>
            <Link href="/" style={{ width: "100%" }}>
              <HStack
                color="whiteAlpha.800"
                _hover={{ color: "white" }}
                alignItems="center"
              >
                <Icon as={IoFileTrayFull} />
                <Text fontSize="14px">All Contracts</Text>
              </HStack>
            </Link>
          </VStack>
        </VStack>
        <w3m-button balance="hide" />
      </VStack>
    </Box>
  );
}

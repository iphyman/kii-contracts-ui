"use client";

import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { AiOutlineFileAdd } from "react-icons/ai";
import { IoFileTrayFull } from "react-icons/io5";

export default function Sidebar() {
  return (
    <Box
      w="14rem"
      minH="100%"
      bg="bg.subtle"
      borderRight="1px solid"
      borderRightColor="border"
      padding="12px"
    >
      <VStack w="full" h="full">
        <VStack w=" full" flex={1}>
          {/* @ts-expect-error msg */}
          <appkit-network-button />
          <VStack w="full" gap={4} mt="2rem">
            <Link href="/add-contract" style={{ width: "100%" }}>
              <HStack
                color="fg.muted"
                _hover={{ color: "fg" }}
                alignItems="center"
              >
                <Icon as={AiOutlineFileAdd} />
                <Text fontSize="14px">Add New Contract</Text>
              </HStack>
            </Link>
            <Link href="/" style={{ width: "100%" }}>
              <HStack
                color="fg.muted"
                _hover={{ color: "fg" }}
                alignItems="center"
              >
                <Icon as={IoFileTrayFull} />
                <Text fontSize="14px">All Contracts</Text>
              </HStack>
            </Link>
          </VStack>
        </VStack>
        {/* @ts-expect-error msg */}
        <appkit-connect-button />
      </VStack>
    </Box>
  );
}

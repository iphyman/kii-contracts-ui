"use client";

import {
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

export default function View() {
  return (
    <VStack w="full">
      <Heading fontSize="2rem">Contracts</Heading>
      <Text color="whiteAlpha.700">
        You will find a list of all the contracts you have deployed or
        interacted with recently
      </Text>
      <TableContainer w="full" mt="4rem">
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Address</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr cursor="pointer">
              <Td>USDC Mock</Td>
              <Td>0x000000000</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}

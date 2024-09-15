"use client";

import { useApplication } from "@app/hooks";
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
import { useRouter } from "next/navigation";

export default function View() {
  const { contractStore } = useApplication();
  const router = useRouter();

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
            {contractStore.map((p, index) => (
              <Tr
                cursor="pointer"
                key={index}
                onClick={() => router.push(`/contract?address=${p.address}`)}
              >
                <Td>{p.name?.length === 0 ? "Untitled Contract" : p.name}</Td>
                <Td>{p.address}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}

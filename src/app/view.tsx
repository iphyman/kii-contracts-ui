"use client";

import { useApplication } from "@app/hooks";
import { Heading, Table, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function View() {
  const { contractStore } = useApplication();
  const router = useRouter();

  return (
    <VStack w="full">
      <Heading fontSize="2rem" color="fg">
        Contracts
      </Heading>
      <Text color="fg.muted">
        You will find a list of all the contracts you have deployed or
        interacted with recently
      </Text>
      <Table.Root w="full" mt="4rem">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Address</Table.ColumnHeader>
            <Table.ColumnHeader>ChainId</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {contractStore.map((p, index) => (
            <Table.Row
              cursor="pointer"
              key={index}
              onClick={() => router.push(`/contract?address=${p.address}`)}
            >
              <Table.Cell>
                {p.name?.length === 0 ? "Untitled Contract" : p.name}
              </Table.Cell>
              <Table.Cell>{p.address}</Table.Cell>
              <Table.Cell>{p.chainId}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </VStack>
  );
}

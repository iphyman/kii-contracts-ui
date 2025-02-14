"use client";

import { useApplication } from "@app/hooks";
import { EmptyState, Heading, Table, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaFileContract } from "react-icons/fa6";

export default function View() {
  const { contractStore } = useApplication();
  const router = useRouter();
  const isEmpty = contractStore.length === 0;

  return (
    <VStack w="full">
      <Heading fontSize="2rem" color="fg">
        Contracts
      </Heading>
      <Text color="fg.muted">
        You will find a list of all the contracts you have deployed or
        interacted with recently
      </Text>
      <Table.Root w="full" mt="4rem" showColumnBorder striped interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Address</Table.ColumnHeader>
            <Table.ColumnHeader>ChainId</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isEmpty ? (
            <Table.Row>
              <Table.Cell colSpan={3}>
                <EmptyState.Root>
                  <EmptyState.Content>
                    <EmptyState.Indicator>
                      <FaFileContract />
                    </EmptyState.Indicator>
                    <VStack textAlign="center">
                      <EmptyState.Title>
                        Your contract list is Empty
                      </EmptyState.Title>
                      <EmptyState.Description>
                        Get started by importing or deploying a new smart
                        contract
                      </EmptyState.Description>
                    </VStack>
                  </EmptyState.Content>
                </EmptyState.Root>
              </Table.Cell>
            </Table.Row>
          ) : (
            contractStore.map((p, index) => (
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
            ))
          )}
        </Table.Body>
      </Table.Root>
    </VStack>
  );
}

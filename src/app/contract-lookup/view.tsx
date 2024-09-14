"use client";

import { QuestionHelper } from "@app/components/QuestionHelper";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";

export default function View() {
  return (
    <VStack w="full">
      <Heading fontSize="2rem">Add Contract From Address</Heading>
      <Text color="whiteAlpha.700">
        You can add an already deployed contract to interact with
      </Text>
      <VStack w="full" mt="4rem" spacing={7}>
        <FormControl>
          <HStack>
            <FormLabel mr="0px">Contract Address</FormLabel>
            <QuestionHelper text="The address of the contract you wish to interact with" />
          </HStack>
          <Input placeholder="Contract address" />
        </FormControl>
        <FormControl>
          <HStack>
            <FormLabel mr="0px">Contract ABI</FormLabel>
            <QuestionHelper text="The contract ABI" />
          </HStack>
          <Textarea placeholder="Paste the contract ABI" />
        </FormControl>
        <FormControl>
          <Button colorScheme="teal">Lookup</Button>
        </FormControl>
      </VStack>
    </VStack>
  );
}

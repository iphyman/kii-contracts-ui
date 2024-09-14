"use client";

import { Identicon } from "@app/components/Identicon";
import { QuestionHelper } from "@app/components/QuestionHelper";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { BsUpload } from "react-icons/bs";
import { useAccount } from "wagmi";

export default function View() {
  const uploaderRef = useRef<HTMLInputElement>(null);
  const { address: account } = useAccount();

  return (
    <VStack w="full">
      <Heading fontSize="2rem">Deploy Contract</Heading>
      <Text color="whiteAlpha.700">
        You can deploy and instantiate new contract code.
      </Text>
      <VStack w="full" spacing={7} mt="64px">
        <FormControl>
          <HStack>
            <FormLabel mr="0px">Deployer</FormLabel>
            <QuestionHelper text="The connected account that will be the message sender" />
          </HStack>
          <Box
            w="full"
            h="4rem"
            borderRadius="8px"
            border="1px solid"
            borderColor="whiteAlpha.300"
            padding="8px 16px"
          >
            {!account ? (
              <w3m-button />
            ) : (
              <HStack w="full" h="full">
                <Identicon address={account} />
                <Text>{account}</Text>
              </HStack>
            )}
          </Box>
        </FormControl>
        <FormControl>
          <HStack>
            <FormLabel mr="0px">Contract Name</FormLabel>
            <QuestionHelper text="A name to distinguish this contract with" />
          </HStack>
          <Input placeholder="A discriptive name for this contract" />
        </FormControl>
        <FormControl>
          <HStack>
            <FormLabel mr="0px">Upload Contract Artifact</FormLabel>
            <QuestionHelper text="The contract JSON artifact generated after compiling with hardhat or foundry" />
          </HStack>
          <VStack
            w="full"
            h="9rem"
            borderRadius="0.25rem"
            border="1px solid"
            borderColor="whiteAlpha.300"
            justifyContent="center"
            alignItems="center"
            cursor="pointer"
            onClick={() => uploaderRef?.current?.click()}
          >
            <Icon as={BsUpload} fontSize="32px" />
            <Text color="whiteAlpha.700">
              Click to select or drag and drop to upload file
            </Text>
            <Input type="file" display="none" ref={uploaderRef} />
          </VStack>
        </FormControl>
        <FormControl>
          <Button colorScheme="teal">Deploy Contract</Button>
        </FormControl>
      </VStack>
    </VStack>
  );
}

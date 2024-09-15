"use client";

import { useApplication } from "@app/hooks";
import {
  Button,
  Code,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa6";
import { AbiParameter } from "viem";
import { useReadContract } from "wagmi";

export default function View() {
  const searchParams = useSearchParams();
  const { contractStore } = useApplication();
  const [functionName, setFunctionName] = useState<string | undefined>(
    undefined
  );
  const { isOpen, onClose, onOpen } = useDisclosure();
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const [args, setArgs] = useState<any[]>([]);
  const [argsInputs, setArgsInput] = useState<AbiParameter[] | undefined>(
    undefined
  );
  const contractAddress = searchParams.get("address");
  const activeContract = contractStore.find(
    (p) => p.address.toLowerCase() === contractAddress?.toLowerCase()
  );

  const abiFunctions = activeContract?.abi.filter((p) => p.type === "function");
  const readFunctions = abiFunctions?.filter(
    (p) => p.stateMutability === "view"
  );
  const writeFunctions = abiFunctions?.filter(
    (p) => p.stateMutability === "nonpayable" || p.stateMutability === "payable"
  );

  const contractName =
    !activeContract?.name || activeContract.name.length === 0
      ? "Unknown Contract"
      : activeContract.name;

  const { data, refetch } = useReadContract({
    abi: activeContract?.abi,
    address: activeContract?.address,
    functionName: functionName,
    args,
  });

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const readData: any = data;

  const handleContractCall = () => {
    const func = abiFunctions?.find((p) => p.name === functionName);

    if (func) {
      if (func.stateMutability === "view") {
        refetch();
      }
    }
  };

  useEffect(() => {
    if (functionName) {
      setArgs([]);
    }
  }, [functionName]);

  return (
    <>
      <VStack w="full">
        <Heading fontSize="2rem" textTransform="capitalize">
          {contractName}
        </Heading>
        <Text color="whiteAlpha.700" textAlign="center">
          {`You are ready to interact with ${contractName} deployed on Kiichain
        Testnet at ${activeContract?.address}`}
        </Text>
        <VStack w="full" spacing={7} mt="4rem">
          {readFunctions && (
            <VStack w="full" spacing={7} alignItems="flex-start">
              <Text>Read only functions</Text>
              {readFunctions.map((p) => (
                <HStack spacing={5} key={p.name}>
                  <IconButton
                    icon={<FaPlay />}
                    aria-label="call function"
                    onClick={() => {
                      setFunctionName(p.name);
                      setArgsInput([...p.inputs]);
                      onOpen();
                    }}
                  />
                  <Text fontStyle="italic">{`${p.name} (${p.inputs
                    .map((x) => x.type)
                    .join(",")})`}</Text>
                </HStack>
              ))}
            </VStack>
          )}

          {writeFunctions && (
            <VStack w="full" spacing={7} alignItems="flex-start">
              <Text>Read & Write functions</Text>
              {writeFunctions.map((p) => (
                <HStack spacing={5} key={p.name}>
                  <IconButton
                    icon={<FaPlay />}
                    aria-label="call function"
                    onClick={() => {
                      setFunctionName(p.name);
                      setArgsInput([...p.inputs]);
                      onOpen();
                    }}
                  />
                  <Text fontStyle="italic">{`${p.name} (${p.inputs
                    .map((x) => x.type)
                    .join(",")})`}</Text>
                </HStack>
              ))}
            </VStack>
          )}
        </VStack>
      </VStack>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader>{`${functionName} Inputs`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack w="full" spacing={7}>
              {argsInputs ? (
                argsInputs.map((p, index) => (
                  <FormControl key={index}>
                    <FormLabel fontStyle="italic">{`${p.name} (${p.type})`}</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) => {
                        const inputArgs = [...args];
                        inputArgs[index] = e.target.value;
                        setArgs(inputArgs);
                      }}
                    />
                  </FormControl>
                ))
              ) : (
                <Text>No Inputs Required</Text>
              )}
              {readData && (
                <Code w="full">
                  {JSON.stringify(readData, (_, v) =>
                    typeof v === "bigint" ? v.toString() : v
                  )}
                </Code>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter w="full">
            <Button
              colorScheme="blue"
              mr={3}
              w="full"
              onClick={handleContractCall}
            >
              Call Contract
            </Button>
            <Button onClick={onClose} w="full">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

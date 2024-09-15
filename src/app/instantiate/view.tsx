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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { Hash } from "viem";
import {
  useAccount,
  useDeployContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Abi } from "abitype/zod";
import { AbiParameter } from "abitype";
import { useApplication } from "@app/hooks";
import { useRouter } from "next/navigation";

type FoundryByteCode = {
  readonly object: Hash;
};

type ArtifactJson = {
  readonly contractName?: string;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  readonly abi: any[];
  readonly bytecode: Hash;
};

type ContructorArgs =
  | ({
      payable?: boolean | undefined;
      constant?: boolean | undefined;
      gas?: number | undefined;
    } & {
      inputs: readonly AbiParameter[];
      type: "constructor";
      stateMutability: "nonpayable" | "payable";
    })
  | undefined;

export default function View() {
  const uploaderRef = useRef<HTMLInputElement>(null);
  const { address: account } = useAccount();
  const [artifact, setArtifact] = useState<string | undefined>(undefined);
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const [args, setArgs] = useState<any[]>([]);
  const [argsInputs, setArgsInput] = useState<ContructorArgs>(undefined);
  const [contractName, setContractName] = useState<string>("");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { deployContract, data: hash, error } = useDeployContract();
  const toast = useToast();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });
  const { contractStore, updateContractStore } = useApplication();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");

      fileReader.onload = (e) => {
        setArtifact(e.target?.result as string);
      };
    }
  };

  const handleSetContructorArgs = () => {
    if (!artifact || !account) return;

    const parsedArtifact: ArtifactJson = JSON.parse(artifact);
    const contractAbi = Abi.safeParse(parsedArtifact.abi);

    if (contractAbi.success) {
      const constInputs = contractAbi.data.find(
        (x) => x.type === "constructor"
      );
      setArgsInput(constInputs);
      onOpen();
    } else {
      toast({
        title: "Oops!",
        description: "You have uploaded an invalid contract artifact",
        status: "error",
      });
    }
  };

  const handleDeploy = () => {
    if (!artifact || !account) return;

    const parsedArtifact: ArtifactJson = JSON.parse(artifact);
    let bytescode: Hash;

    if (typeof parsedArtifact.bytecode === "object") {
      bytescode = (parsedArtifact.bytecode as FoundryByteCode).object;
    } else {
      bytescode = parsedArtifact.bytecode;
    }

    deployContract({
      abi: parsedArtifact.abi,
      args: args,
      bytecode: bytescode,
      account,
    });
  };

  useEffect(() => {
    const contractAddress = receipt?.contractAddress;
    if (isConfirmed && contractAddress && artifact) {
      toast({
        title: "Successful!",
        description: `Contract deployed successfully at ${contractAddress}`,
        status: "success",
      });

      const parsedArtifact: ArtifactJson = JSON.parse(artifact);
      updateContractStore([
        ...contractStore,
        {
          name: contractName,
          address: contractAddress,
          abi: parsedArtifact.abi,
        },
      ]);

      // redirect to contracts view
      router.push(`/contract?=${contractAddress}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed]);

  useEffect(() => {
    if (error) {
      toast({
        title: `Oops! ${error.name}`,
        description: error.message,
        status: "error",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <>
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
            <Input
              placeholder="A discriptive name for this contract"
              onChange={(e) => setContractName(e.target.value)}
            />
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
              <Input
                type="file"
                display="none"
                ref={uploaderRef}
                accept="application/json"
                onChange={handleFileChange}
              />
            </VStack>
          </FormControl>
          <FormControl>
            <Button
              colorScheme="teal"
              onClick={handleSetContructorArgs}
              isDisabled={!account}
            >
              Continue
            </Button>
          </FormControl>
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
          <ModalHeader>Enter Contructor Arguments</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack w="full" spacing={7}>
              {argsInputs?.inputs.map((p, index) => (
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
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter w="full">
            <Button
              colorScheme="blue"
              mr={3}
              w="full"
              onClick={handleDeploy}
              isLoading={isConfirming}
            >
              Deploy Contract
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

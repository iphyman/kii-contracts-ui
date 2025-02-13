"use client";

import { Identicon } from "@app/components/Identicon";
import { QuestionHelper } from "@app/components/QuestionHelper";
import {
  Box,
  Button,
  Field,
  Heading,
  HStack,
  Icon,
  Input,
  Text,
  useDisclosure,
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
import { toaster } from "@app/components/ui/toaster";
import { useAppKitNetwork } from "@reown/appkit/react";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@app/components/ui/dialog";

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
  const { open, onClose, onOpen } = useDisclosure();
  const { deployContract, data: hash, error } = useDeployContract();
  const { chainId } = useAppKitNetwork();

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
      toaster.create({
        title: "Oops!",
        description: "You have uploaded an invalid contract artifact",
        type: "error",
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
      toaster.create({
        title: "Successful!",
        description: `Contract deployed successfully at ${contractAddress}`,
        type: "success",
      });

      const parsedArtifact: ArtifactJson = JSON.parse(artifact);
      updateContractStore([
        ...contractStore,
        {
          name: contractName,
          address: contractAddress,
          abi: parsedArtifact.abi,
          chainId: Number(chainId),
        },
      ]);

      // redirect to contracts view
      router.push(`/contract?address=${contractAddress}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed]);

  useEffect(() => {
    if (error) {
      toaster.create({
        title: `Oops! ${error.name}`,
        description: error.message,
        type: "error",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <>
      <VStack w="full">
        <Heading fontSize="2rem" color="fg">
          Deploy Contract
        </Heading>
        <Text color="fg.muted">
          You can deploy and instantiate new contract code.
        </Text>
        <VStack w="full" gap={7} mt="64px">
          <Field.Root>
            <HStack>
              <Field.Label mr="0px">Deployer</Field.Label>
              <QuestionHelper text="The connected account that will be the message sender" />
            </HStack>
            <Box
              w="full"
              h="4rem"
              borderRadius="8px"
              border="1px solid"
              borderColor="border"
              padding="8px 16px"
            >
              {!account ? (
                <appkit-connect-button />
              ) : (
                <HStack w="full" h="full">
                  <Identicon address={account} />
                  <Text>{account}</Text>
                </HStack>
              )}
            </Box>
          </Field.Root>
          <Field.Root>
            <HStack>
              <Field.Label mr="0px">Contract Name</Field.Label>
              <QuestionHelper text="A name to distinguish this contract with" />
            </HStack>
            <Input
              placeholder="A discriptive name for this contract"
              onChange={(e) => setContractName(e.target.value)}
            />
          </Field.Root>
          <Field.Root>
            <HStack>
              <Field.Label mr="0px">Upload Contract Artifact</Field.Label>
              <QuestionHelper text="The contract JSON artifact generated after compiling with hardhat or foundry" />
            </HStack>
            <VStack
              w="full"
              h="9rem"
              borderRadius="0.25rem"
              border="1px solid"
              borderColor="border"
              justifyContent="center"
              alignItems="center"
              cursor="pointer"
              onClick={() => uploaderRef?.current?.click()}
            >
              <Icon as={BsUpload} fontSize="32px" />
              <Text color="fg.muted">
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
          </Field.Root>
          <Field.Root>
            <Button
              colorPalette="teal"
              onClick={handleSetContructorArgs}
              disabled={!account}
            >
              Continue
            </Button>
          </Field.Root>
        </VStack>
      </VStack>
      <DialogRoot
        closeOnInteractOutside={false}
        open={open}
        onOpenChange={onClose}
      >
        <DialogBackdrop />
        <DialogContent bg="bg.panel">
          <DialogHeader color="fg">Enter Contructor Arguments</DialogHeader>
          <DialogCloseTrigger />
          <DialogBody pb={6}>
            <VStack w="full" gap={7}>
              {argsInputs?.inputs.map((p, index) => (
                <Field.Root key={index}>
                  <Field.Label fontStyle="italic">{`${p.name} (${p.type})`}</Field.Label>
                  <Input
                    type="text"
                    onChange={(e) => {
                      const inputArgs = [...args];
                      inputArgs[index] = e.target.value;
                      setArgs(inputArgs);
                    }}
                  />
                </Field.Root>
              ))}
            </VStack>
          </DialogBody>
          <DialogFooter w="full">
            <Button
              colorPalette="blue"
              mr={3}
              w="full"
              onClick={handleDeploy}
              loading={isConfirming}
            >
              Deploy Contract
            </Button>
            <Button colorPalette="gray" onClick={onClose} w="full">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}

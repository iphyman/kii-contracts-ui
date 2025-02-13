"use client";

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@app/components/ui/dialog";
import { toaster } from "@app/components/ui/toaster";
import { useApplication } from "@app/hooks";
import {
  Button,
  Code,
  Field,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa6";
import { AbiParameter } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export default function View() {
  const searchParams = useSearchParams();
  const { contractStore } = useApplication();
  const [functionName, setFunctionName] = useState<string | undefined>(
    undefined
  );
  const [payable, setPayable] = useState<string | undefined>(undefined);
  const { open, onClose, onOpen } = useDisclosure();
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
    (p) => p.stateMutability === "view" || p.stateMutability === "pure"
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

  const { data: hash, isPending, error, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const { address: account } = useAccount();

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const readData: any = data;

  const handleContractCall = () => {
    const func = abiFunctions?.find((p) => p.name === functionName);

    if (func) {
      if (func.stateMutability === "view" || func.stateMutability === "pure") {
        refetch();
      } else {
        if (!activeContract || !functionName || !account) return;

        writeContract({
          abi: activeContract.abi,
          address: activeContract.address,
          functionName,
          args,
          account,
          value: payable ? BigInt(payable) : undefined,
        });
      }
    }
  };

  useEffect(() => {
    if (functionName) {
      setArgs([]);
      setPayable(undefined);
    }
  }, [functionName]);

  useEffect(() => {
    if (isConfirmed) {
      toaster.create({
        title: "Successful!",
        description: "Action completed!",
        type: "success",
      });
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
        <Heading fontSize="2rem" color="fg" textTransform="capitalize">
          {contractName}
        </Heading>
        <Text color="fg.muted" textAlign="center">
          {`You are ready to interact with ${contractName} deployed on Kiichain
        Testnet at ${activeContract?.address}`}
        </Text>
        <VStack w="full" gap={7} mt="4rem">
          {readFunctions && (
            <VStack w="full" gap={7} alignItems="flex-start">
              <Text color="fg">Read only functions</Text>
              {readFunctions.map((p) => (
                <HStack gap={5} key={p.name}>
                  <IconButton
                    aria-label="call function"
                    onClick={() => {
                      setFunctionName(p.name);
                      setArgsInput([...p.inputs]);
                      onOpen();
                    }}
                  >
                    <FaPlay />
                  </IconButton>
                  <Text
                    fontStyle="italic"
                    color="fg.muted"
                  >{`function ${p.name} (${p.inputs
                    .map((x) => x.type)
                    .join(",")}) ${p.stateMutability} {}`}</Text>
                </HStack>
              ))}
            </VStack>
          )}

          {writeFunctions && (
            <VStack w="full" gap={7} alignItems="flex-start">
              <Text color="fg">Read & Write functions</Text>
              {writeFunctions.map((p) => (
                <HStack gap={5} key={p.name}>
                  <IconButton
                    aria-label="call function"
                    onClick={() => {
                      setFunctionName(p.name);
                      setArgsInput([...p.inputs]);
                      if (p.stateMutability === "payable") {
                        setPayable("0");
                      }
                      onOpen();
                    }}
                  >
                    <FaPlay />
                  </IconButton>
                  <Text
                    fontStyle="italic"
                    color="fg.muted"
                  >{`function ${p.name} (${p.inputs
                    .map((x) => x.type)
                    .join(",")}) ${p.stateMutability} {}`}</Text>
                </HStack>
              ))}
            </VStack>
          )}
        </VStack>
      </VStack>
      <DialogRoot
        closeOnInteractOutside={false}
        open={open}
        onOpenChange={onClose}
      >
        <DialogBackdrop />
        <DialogContent bg="bg.panel">
          <DialogHeader color="fg">{`${functionName} Inputs`}</DialogHeader>
          <DialogCloseTrigger />
          <DialogBody pb={6}>
            <VStack w="full" gap={7}>
              {payable && (
                <Field.Root>
                  <Field.Label fontStyle="italic">Payable (wei)</Field.Label>
                  <Input
                    type="string"
                    value={payable}
                    onChange={(e) => setPayable(e.target.value)}
                  />
                </Field.Root>
              )}
              {argsInputs ? (
                argsInputs.map((p, index) => (
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
          </DialogBody>
          <DialogFooter w="full">
            <Button
              colorPalette="blue"
              mr={3}
              w="full"
              onClick={handleContractCall}
              disabled={isPending}
              loading={isConfirming}
            >
              Call Contract
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

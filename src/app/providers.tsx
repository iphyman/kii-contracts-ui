"use client";

import Sidebar from "@app/components/Sidebar";
import { queryClient, wagmiConfig } from "@app/configs";
import { theme } from "@app/theme";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { State, WagmiProvider } from "wagmi";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId,
  enableAnalytics: true,
  chainImages: {
    123454321: "/logo-gradient.svg",
  },
});

export default function Providers({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: State;
}) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <WagmiProvider config={wagmiConfig} initialState={initialState}>
          <QueryClientProvider client={queryClient}>
            <Flex minH="100vh" bg="blackAlpha.400">
              <Sidebar />
              <Flex flex={1} padding="2.5rem">
                {children}
              </Flex>
            </Flex>
          </QueryClientProvider>
        </WagmiProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}

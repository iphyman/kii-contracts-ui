"use client";

import Sidebar from "@app/components/Sidebar";
import { chains, metadata, queryClient, wagmiAdapter } from "@app/configs";
import {
  ChakraProvider,
  ClientOnly,
  defaultSystem,
  Flex,
} from "@chakra-ui/react";
import { abstract } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { State, WagmiProvider } from "wagmi";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@app/components/ui/toaster";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: chains,
  defaultNetwork: abstract,
  metadata: metadata,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
  },
  chainImages: {
    // 295: "/assets/hedera.png",
    // 2741: "/assets/abstract.jpg",
    // 2818: "/assets/morph.png",
    // 42220: "/assets/celo.png",
    // 81457: "/assets/blast.png",
    // 534352: "/assets/scroll.png",
    // 167000: "/assets/taiko.png",
    // 1301: "/assets/unichain.svg",
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
    <ClientOnly>
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <WagmiProvider
            config={wagmiAdapter.wagmiConfig}
            initialState={initialState}
          >
            <QueryClientProvider client={queryClient}>
              <Flex minH="100vh" bg="bg">
                <Sidebar />
                <Flex flex={1} padding="2.5rem">
                  {children}
                  <Toaster />
                </Flex>
              </Flex>
            </QueryClientProvider>
          </WagmiProvider>
        </ThemeProvider>
      </ChakraProvider>
    </ClientOnly>
  );
}

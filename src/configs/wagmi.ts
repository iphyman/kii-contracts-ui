import { createClient } from "viem";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { chains } from "./chains";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Kiichain Contracts Ui",
  description:
    "Kiichain Contracts Ui, smart contract deployment and interaction tool",
  url: "http://localhost:3000", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
export const wagmiConfig = createConfig({
  chains, // required
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
  connectors: [
    injected({}),
    walletConnect({
      projectId,
      metadata,
    }),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

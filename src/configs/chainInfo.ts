import { type Chain } from "viem";

export const kiichainTestnet = {
  id: 123454321,
  name: "Kiichain Testnet",
  nativeCurrency: { name: "Kii", symbol: "KII", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://a.sentry.testnet.kiivalidator.com:8645"] },
  },
  blockExplorers: {
    default: { name: "kiiscan", url: "https://app.kiichain.io/kiichain" },
  },
} as const satisfies Chain;

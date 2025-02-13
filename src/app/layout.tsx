import { wagmiAdapter } from "@app/configs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import Providers from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EVM Contracts Ui",
  description:
    "Smart contract deployment and interaction tool for EVM compatible blockchains",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const header = await headers();
  const cookies = header.get("cookie");
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}

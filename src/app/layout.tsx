import { wagmiConfig } from "@app/configs";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";

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
  title: "Kiichain Contracts Ui",
  description:
    "Smart contract deployment and interaction tool for Kiichain and other EVM compatible blockchains",
};

const Providers = dynamic(() => import("./providers"), { ssr: false });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    wagmiConfig,
    headers().get("cookie")
  );

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}

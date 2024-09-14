"use client";

import { Box } from "@chakra-ui/react";
import { Address } from "viem";

const getColors = (address: string) => {
  const colors: string[] = [];
  const seeds = address.match(/.{1,7}/g)?.splice(0, 5);

  seeds?.forEach((seed) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }

    const rgb = [0, 0, 0];
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 255;
      rgb[i] = value;
    }
    colors.push(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
  });

  return colors;
};

export function Identicon({ address }: { address: Address }) {
  const colors = getColors(address);

  return (
    <Box
      boxSize="2.5rem"
      borderRadius="9999px"
      boxShadow="inset 0 0 0 1px rgba(0, 0, 0, 0.1)"
      bg={colors[0]}
      bgImage={`
        radial-gradient(at 66% 77%, ${colors[1]} 0px, transparent 50%),
    radial-gradient(at 29% 97%, ${colors[2]} 0px, transparent 50%),
    radial-gradient(at 99% 86%, ${colors[3]} 0px, transparent 50%),
    radial-gradient(at 29% 88%, ${colors[4]} 0px, transparent 50%)
        `}
    />
  );
}

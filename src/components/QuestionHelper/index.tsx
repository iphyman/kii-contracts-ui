"use client";

import { chakra, Tooltip } from "@chakra-ui/react";
import { FaRegCircleQuestion } from "react-icons/fa6";

export function QuestionHelper({ text }: { text: string }) {
  return (
    <Tooltip label={text} hasArrow>
      <chakra.span fontSize="14px" color="whiteAlpha.700">
        <FaRegCircleQuestion />
      </chakra.span>
    </Tooltip>
  );
}

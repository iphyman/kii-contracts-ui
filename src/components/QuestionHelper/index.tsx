"use client";

import { chakra } from "@chakra-ui/react";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { Tooltip } from "../ui/tooltip";

export function QuestionHelper({ text }: { text: string }) {
  return (
    <Tooltip content={text} showArrow>
      <chakra.span fontSize="14px" color="fg.muted">
        <FaRegCircleQuestion />
      </chakra.span>
    </Tooltip>
  );
}

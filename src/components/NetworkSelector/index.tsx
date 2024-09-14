"use client";

import {
  Button,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export default function NetworkSelector() {
  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            w="full"
            isActive={isOpen}
            as={Button}
            rightIcon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
            textAlign="left"
            fontSize="14px"
            bg="gray.900"
            borderColor="whiteAlpha.300"
            border="1px solid"
            _before={{
              content: '""',
              width: "6px",
              height: "6px",
              borderRadius: "9999px",
              backgroundColor: "rgb(52 211 153)",
              marginRight: "5px",
            }}
          >
            Kii Testnet
          </MenuButton>
          <MenuList minW="12.5rem" bg="gray.900">
            <MenuGroup title="LIVE NETWORKS" fontSize="10px" fontWeight={400}>
              <MenuItem isDisabled fontSize="14px" bg="gray.900">
                Kii Mainnet
              </MenuItem>
            </MenuGroup>
            <MenuGroup title="TEST NETWORKS" fontSize="10px" fontWeight={400}>
              <MenuItem fontSize="14px" bg="gray.900">
                Kii Testnet
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </>
      )}
    </Menu>
  );
}

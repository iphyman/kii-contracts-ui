import { extendTheme } from "@chakra-ui/react";
import { Styles } from "@chakra-ui/theme-tools";

const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
  cssVarPrefix: "kii",
};

const styles: Styles = {
  global: {
    body: {
      bg: "gray.900",
    },
  },
};

export const theme = extendTheme({
  config,
  styles,
});

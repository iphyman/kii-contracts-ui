import { extendTheme } from "@chakra-ui/react";
import { Styles } from "@chakra-ui/theme-tools";

const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
  cssVarPrefix: "kii",
};

const styles: Styles = {
  global: {
    // body: {},
  },
};

export const theme = extendTheme({
  config,
  styles,
});

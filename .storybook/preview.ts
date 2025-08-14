import type { Preview } from "@storybook/react";
import React from "react";
import { ChakraProvider } from "../src/components/ChakraProvider";
import "../src/app/globals.css";
import "../src/styles/ui.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [Story => React.createElement(ChakraProvider, {}, React.createElement(Story))],
};

export default preview;

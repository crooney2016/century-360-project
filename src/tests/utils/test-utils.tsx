import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/lib/theme";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  withChakra?: boolean;
  withTheme?: boolean;
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  const { withChakra = true, withTheme = true, ...renderOptions } = options || {};

  if (withChakra && withTheme) {
    return render(ui, { wrapper: AllTheProviders, ...renderOptions });
  }

  return render(ui, renderOptions);
};

export * from "@testing-library/react";
export { customRender as render };
export { AllTheProviders };

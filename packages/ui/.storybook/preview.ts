import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/styles/theme.css";
import "../src/styles/tailwind.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    a11y: {
      config: {},
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        "DFL Default": "",
        "DFL Dark": "dark",
        "Custom (Alto Contraste)": "custom-theme",
      },
      defaultTheme: "DFL Default",
    }),
  ],
};

export default preview;

import remarkCallout from "remark-callout";

import nextra from "nextra";
import remarkCalloutConfig from "./src/config/remarkCalloutConfig.js";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  mdxOptions: {
    remarkPlugins: [[remarkCallout, remarkCalloutConfig]],
    rehypePlugins: [],
  },
});

export default withNextra();

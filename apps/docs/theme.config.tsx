import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import siteConfig from "@/config/siteConfig";
import { useRouter } from "next/router";

import Main from "@/components/main";
import { LogoComponent } from "@/components/Logo";

const config: DocsThemeConfig = {
  logo: LogoComponent,
  project: {
    link: siteConfig.URL.PROJECT_REPO,
  },
  docsRepositoryBase: siteConfig.URL.PROJECT_REPO,
  footer: {
    text: "Powered by Nextra",
  },
  navigation: {
    next: true,
    prev: true,
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  editLink: {
    text: "",
  },
  feedback: {
    labels: "",
    content: "",
  },
  main: Main,
  useNextSeoProps: () => {
    const config = useConfig();
    const { asPath } = useRouter();

    const { title, description, cover } = config.frontMatter;

    return {
      title: title && asPath !== "/" ? `${title} | Docs` : siteConfig.meta.title,
      description: description || siteConfig.meta.description,
      openGraph: {
        title: title || siteConfig.meta.title,
        description: description || siteConfig.meta.description,
        images: [{ url: cover || siteConfig.meta.img }],
      },
    };
  },
};

export default config;

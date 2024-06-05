import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import SITE_CONFIG from "@/config/siteConfig";
import { useRouter } from "next/router";

import Main from "@/components/main";
import { LogoComponent } from "@/components/Logo";

const config: DocsThemeConfig = {
  logo: LogoComponent,
  project: {
    link: SITE_CONFIG.URL.PROJECT_REPO,
  },
  docsRepositoryBase: SITE_CONFIG.URL.PROJECT_REPO,
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

    const { title, description, image } = config.frontMatter;

    return {
      title: title && asPath !== "/" ? `${title} | Docs` : SITE_CONFIG.meta.title,
      description: description || SITE_CONFIG.meta.description,
      openGraph: {
        title: title || SITE_CONFIG.meta.title,
        description: description || SITE_CONFIG.meta.description,
        images: [{ url: image || SITE_CONFIG.meta.img }],
      },
    };
  },
};

export default config;

import React from "react";

import { Giscus } from "./Giscus";
import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

const Main = ({ children }) => {
  const { asPath } = useRouter();

  const isNotLoot = asPath !== "/";

  return (
    <>
      <div style={{ marginTop: "3rem" }}>{children}</div>

      {isNotLoot && <Giscus />}
    </>
  );
};

export default Main;

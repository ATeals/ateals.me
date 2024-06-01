import React from "react";

import { Giscus } from "./Giscus";
import { useRouter } from "next/router";

const Main = ({ children }) => {
  const { asPath } = useRouter();

  const isNotLoot = asPath !== "/";

  return (
    <>
      {children}

      {isNotLoot && <Giscus />}
    </>
  );
};

export default Main;
